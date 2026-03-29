import JSZip from 'jszip';
import type { FactoryWorkspaceImportFile } from '@/lib/api/vala-factory';

const TEXT_FILE_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.sql', '.php', '.py', '.html', '.css', '.scss', '.yaml', '.yml', '.toml', '.txt', '.env', '.xml', '.sh', '.ini'
]);

const MAX_TEXT_CHARS = 200000;
const MAX_EXCERPT_CHARS = 4000;

function extensionOf(path: string) {
  const normalized = path.toLowerCase();
  const index = normalized.lastIndexOf('.');
  return index >= 0 ? normalized.slice(index) : '';
}

function isTextFile(path: string, mimeType?: string) {
  if (mimeType?.startsWith('text/')) return true;
  if (mimeType?.includes('json')) return true;
  return TEXT_FILE_EXTENSIONS.has(extensionOf(path));
}

function trimTextContent(value: string) {
  return value.length > MAX_TEXT_CHARS ? value.slice(0, MAX_TEXT_CHARS) : value;
}

async function toSha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function fileToImportRecord(filePath: string, file: File): Promise<FactoryWorkspaceImportFile> {
  const textLike = isTextFile(filePath, file.type);
  if (!textLike) {
    return {
      path: filePath,
      name: file.name,
      size_bytes: file.size,
      mime_type: file.type || 'application/octet-stream',
      truncated: true,
      metadata: { binary: true },
    };
  }

  const text = await file.text();
  const content = trimTextContent(text);
  return {
    path: filePath,
    name: file.name,
    size_bytes: file.size,
    mime_type: file.type || 'text/plain',
    content,
    content_excerpt: content.slice(0, MAX_EXCERPT_CHARS),
    truncated: text.length > content.length,
    sha256: await toSha256(content),
  };
}

export async function parseMultipleWorkspaceFiles(fileList: FileList | File[]) {
  const files = Array.from(fileList);
  return await Promise.all(files.map((file) => fileToImportRecord(file.webkitRelativePath || file.name, file)));
}

export async function parseZipWorkspace(file: File) {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const records: FactoryWorkspaceImportFile[] = [];

  for (const entry of Object.values(zip.files)) {
    if (entry.dir) continue;

    const path = entry.name.replace(/^\/+/, '');
    const textLike = isTextFile(path);
    if (!textLike) {
      records.push({
        path,
        name: path.split('/').pop() || path,
        size_bytes: Number(entry._data?.uncompressedSize || 0),
        mime_type: 'application/octet-stream',
        truncated: true,
        metadata: { binary: true },
      });
      continue;
    }

    const text = await entry.async('text');
    const content = trimTextContent(text);
    records.push({
      path,
      name: path.split('/').pop() || path,
      size_bytes: Number(entry._data?.uncompressedSize || content.length),
      mime_type: 'text/plain',
      content,
      content_excerpt: content.slice(0, MAX_EXCERPT_CHARS),
      truncated: text.length > content.length,
      sha256: await toSha256(content),
    });
  }

  return records;
}