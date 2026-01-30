import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  Play, Heart, ShoppingCart, Filter, Search, Bell,
  GraduationCap, Stethoscope, Utensils, Hotel, Home, Car, Plane,
  CreditCard, Factory, Users, Truck, Building, BookOpen, FlaskConical,
  Phone, Pill, Package, MapPin, Star, Award, CheckCircle, Wallet, Landmark,
  FileText, Calculator, Receipt, PieChart, ClipboardCheck, Coins, Target,
  TrendingUp, Megaphone, Share2, Mail, Zap, BarChart3, UserCheck, DollarSign,
  Clock, Calendar, Briefcase, UserCog, Fingerprint, ShoppingBag, Store, Globe,
  Headphones, MessageSquare, Scale, Shield, Lock, Server, Cpu, Database,
  Wifi, Camera, Key, AlertTriangle, HardDrive, Eye, Radio, PhoneCall,
  Mic, MonitorPlay, FileCheck, Gavel, ScrollText, Vote, Building2, Lightbulb, Code2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import softwareValaLogo from "@/assets/software-vala-logo.jpg";

interface Demo {
  id: string;
  name: string;
  category: string;
  masterCategory: string;
  description: string;
  url: string;
  icon: any;
  status: "ACTIVE" | "COMING_SOON";
  features: string[];
  frontend: string[];
  backend: string[];
  color: string;
  price: string;
  discountPrice: string;
}

const allDemos: Demo[] = [
  // ============= FEATURED ACTIVE DEMOS (First 20 with Live Routes) =============
  {
    id: "school-management",
    name: "School Management Software",
    category: "School Management",
    masterCategory: "Education",
    description: "Complete school management with student records, attendance, timetable, and parent communication.",
    url: "/demo/school-erp",
    icon: GraduationCap,
    status: "ACTIVE",
    features: ["Student Records", "Attendance", "Timetable", "Parent Portal"],
    frontend: ["React", "TypeScript", "Education UI"],
    backend: ["Node.js", "PostgreSQL", "SMS API"],
    color: "from-blue-600 to-indigo-600",
    price: "₹59,999",
    discountPrice: "₹35,999"
  },
  {
    id: "gym-fitness",
    name: "Gym & Fitness Center Management",
    category: "Gym Fitness",
    masterCategory: "Healthcare",
    description: "Complete gym management with memberships, trainer scheduling, workout plans, and billing.",
    url: "/demo/gym",
    icon: Users,
    status: "ACTIVE",
    features: ["Memberships", "Trainer Schedule", "Workout Plans", "Billing"],
    frontend: ["React", "TypeScript", "Fitness UI"],
    backend: ["Node.js", "PostgreSQL", "Payment API"],
    color: "from-orange-600 to-red-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "salon-spa",
    name: "Salon & Spa Management",
    category: "Salon Spa",
    masterCategory: "Healthcare",
    description: "Salon management with appointments, services, staff scheduling, and customer loyalty.",
    url: "/demo/salon",
    icon: Star,
    status: "ACTIVE",
    features: ["Appointments", "Services", "Staff Schedule", "Loyalty"],
    frontend: ["React", "TypeScript", "Beauty UI"],
    backend: ["Node.js", "PostgreSQL", "Booking API"],
    color: "from-pink-600 to-rose-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },
  {
    id: "childcare-daycare",
    name: "Childcare & Daycare Management",
    category: "Childcare",
    masterCategory: "Education",
    description: "Daycare management with child profiles, attendance, activities, and parent communication.",
    url: "/demo/childcare",
    icon: Users,
    status: "ACTIVE",
    features: ["Child Profiles", "Attendance", "Activities", "Parent App"],
    frontend: ["React", "TypeScript", "Childcare UI"],
    backend: ["Node.js", "PostgreSQL", "Notification API"],
    color: "from-purple-600 to-pink-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
  },
  {
    id: "petcare-veterinary",
    name: "Pet Care & Veterinary Software",
    category: "Pet Care",
    masterCategory: "Healthcare",
    description: "Pet clinic management with patient records, appointments, prescriptions, and boarding.",
    url: "/demo/petcare",
    icon: Star,
    status: "ACTIVE",
    features: ["Pet Records", "Appointments", "Prescriptions", "Boarding"],
    frontend: ["React", "TypeScript", "Vet UI"],
    backend: ["Node.js", "PostgreSQL", "Medical API"],
    color: "from-green-600 to-teal-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "event-management",
    name: "Event Management Software",
    category: "Event Mgmt",
    masterCategory: "Marketing",
    description: "Event management with planning, registrations, ticketing, and attendee management.",
    url: "/demo/event",
    icon: Calendar,
    status: "ACTIVE",
    features: ["Planning", "Registration", "Ticketing", "Attendees"],
    frontend: ["React", "TypeScript", "Event UI"],
    backend: ["Node.js", "PostgreSQL", "QR API"],
    color: "from-violet-600 to-purple-600",
    price: "₹59,999",
    discountPrice: "₹35,999"
  },
  {
    id: "automotive-dealership",
    name: "Automotive Dealership Software",
    category: "Automotive",
    masterCategory: "Sales & CRM",
    description: "Dealership management with inventory, sales, service, and customer CRM.",
    url: "/demo/automotive",
    icon: Car,
    status: "ACTIVE",
    features: ["Inventory", "Sales", "Service", "CRM"],
    frontend: ["React", "TypeScript", "Auto UI"],
    backend: ["Node.js", "PostgreSQL", "DMS API"],
    color: "from-slate-600 to-gray-600",
    price: "₹79,999",
    discountPrice: "₹47,999"
  },

  // ============= 1. EDUCATION & ELEARNING (7 Sub-categories) =============
  {
    id: "college-erp",
    name: "College / University ERP",
    category: "College ERP",
    masterCategory: "Education",
    description: "University ERP with admission, courses, faculty, exams, and placement management.",
    url: "#",
    icon: Building,
    status: "COMING_SOON",
    features: ["Admissions", "Course Mgmt", "Faculty Portal", "Placements"],
    frontend: ["React", "TypeScript", "Dashboard UI"],
    backend: ["Node.js", "PostgreSQL", "Analytics"],
    color: "from-indigo-600 to-purple-600",
    price: "₹89,999",
    discountPrice: "₹53,999"
  },
  {
    id: "lms",
    name: "Learning Management System",
    category: "LMS",
    masterCategory: "Education",
    description: "Complete LMS with courses, videos, quizzes, certificates, and progress tracking.",
    url: "#",
    icon: BookOpen,
    status: "COMING_SOON",
    features: ["Video Courses", "Quizzes", "Certificates", "Progress Track"],
    frontend: ["React", "TypeScript", "Video Player"],
    backend: ["Node.js", "PostgreSQL", "CDN"],
    color: "from-purple-600 to-pink-600",
    price: "₹69,999",
    discountPrice: "₹41,999"
  },
  {
    id: "coaching-institute",
    name: "Coaching / Institute Management",
    category: "Coaching",
    masterCategory: "Education",
    description: "Coaching center management with batch scheduling, test series, and performance analytics.",
    url: "#",
    icon: Users,
    status: "COMING_SOON",
    features: ["Batch Schedule", "Test Series", "Performance", "Fee Mgmt"],
    frontend: ["React", "TypeScript", "Analytics UI"],
    backend: ["Node.js", "PostgreSQL", "Reports"],
    color: "from-cyan-600 to-blue-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
  },
  {
    id: "online-exam",
    name: "Online Examination System",
    category: "Online Exam",
    masterCategory: "Education",
    description: "Online exam platform with question banks, proctoring, auto-grading, and result analytics.",
    url: "#",
    icon: FlaskConical,
    status: "COMING_SOON",
    features: ["Question Bank", "Proctoring", "Auto-Grade", "Analytics"],
    frontend: ["React", "TypeScript", "Exam UI"],
    backend: ["Node.js", "PostgreSQL", "AI Proctor"],
    color: "from-green-600 to-teal-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
  },
  {
    id: "student-info",
    name: "Student Information System",
    category: "Student Info",
    masterCategory: "Education",
    description: "Centralized student database with academic records, documents, and communication.",
    url: "#",
    icon: UserCheck,
    status: "COMING_SOON",
    features: ["Student DB", "Academic Records", "Documents", "Communication"],
    frontend: ["React", "TypeScript", "Data Grid"],
    backend: ["Node.js", "PostgreSQL", "Cloud Storage"],
    color: "from-blue-500 to-cyan-500",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },
  {
    id: "edu-fees",
    name: "Fees & Accounting for Education",
    category: "Education Fees",
    masterCategory: "Education",
    description: "Education-focused fee collection, receipts, dues tracking, and financial reports.",
    url: "#",
    icon: Calculator,
    status: "COMING_SOON",
    features: ["Fee Collection", "Receipts", "Due Tracking", "Reports"],
    frontend: ["React", "TypeScript", "Finance UI"],
    backend: ["Node.js", "PostgreSQL", "Payment Gateway"],
    color: "from-emerald-600 to-green-600",
    price: "₹34,999",
    discountPrice: "₹20,999"
  },

  // ============= 2. RETAIL & POS SYSTEMS (7 Sub-categories) =============
  {
    id: "retail-pos",
    name: "Retail POS",
    category: "Retail POS",
    masterCategory: "Retail & POS",
    description: "Complete retail POS with barcode scanning, inventory, billing, and sales reports.",
    url: "#",
    icon: ShoppingCart,
    status: "COMING_SOON",
    features: ["Barcode Scan", "Inventory", "Billing", "Sales Reports"],
    frontend: ["React", "TypeScript", "POS UI"],
    backend: ["Node.js", "PostgreSQL", "Print API"],
    color: "from-orange-600 to-red-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
  },
  {
    id: "restaurant-pos",
    name: "Restaurant POS",
    category: "Restaurant POS",
    masterCategory: "Retail & POS",
    description: "Restaurant POS with table management, KOT, billing, and kitchen display system.",
    url: "/demo/restaurant-pos",
    icon: Utensils,
    status: "ACTIVE",
    features: ["Table Mgmt", "KOT System", "Billing", "Kitchen Display"],
    frontend: ["React", "TypeScript", "Restaurant UI"],
    backend: ["Node.js", "PostgreSQL", "Real-time"],
    color: "from-red-600 to-orange-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
  },
  {
    id: "grocery-pos",
    name: "Grocery / Supermarket POS",
    category: "Grocery POS",
    masterCategory: "Retail & POS",
    description: "Supermarket POS with weighing scale integration, loyalty, and express checkout.",
    url: "#",
    icon: Package,
    status: "COMING_SOON",
    features: ["Scale Integration", "Loyalty", "Express", "Stock Alerts"],
    frontend: ["React", "TypeScript", "Grocery UI"],
    backend: ["Node.js", "PostgreSQL", "Hardware API"],
    color: "from-green-600 to-emerald-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "mobile-pos",
    name: "Mobile POS",
    category: "Mobile POS",
    masterCategory: "Retail & POS",
    description: "Mobile-first POS for on-the-go sales, delivery, and outdoor events.",
    url: "#",
    icon: Phone,
    status: "COMING_SOON",
    features: ["Mobile App", "Offline Mode", "QR Pay", "GPS Track"],
    frontend: ["React Native", "TypeScript", "Mobile UI"],
    backend: ["Node.js", "PostgreSQL", "Sync API"],
    color: "from-blue-600 to-purple-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },
  {
    id: "multistore-pos",
    name: "Multi-Store POS",
    category: "Multi-Store POS",
    masterCategory: "Retail & POS",
    description: "Chain store POS with centralized inventory, pricing, and consolidated reports.",
    url: "#",
    icon: Building,
    status: "COMING_SOON",
    features: ["Central Inventory", "Store Sync", "Pricing", "Reports"],
    frontend: ["React", "TypeScript", "Enterprise UI"],
    backend: ["Node.js", "PostgreSQL", "Multi-tenant"],
    color: "from-purple-600 to-indigo-600",
    price: "₹79,999",
    discountPrice: "₹47,999"
  },
  {
    id: "inventory-stock",
    name: "Inventory & Stock Management",
    category: "Inventory",
    masterCategory: "Retail & POS",
    description: "Inventory control with stock levels, reorder alerts, and supplier management.",
    url: "#",
    icon: Package,
    status: "COMING_SOON",
    features: ["Stock Levels", "Reorder Alerts", "Suppliers", "Warehouses"],
    frontend: ["React", "TypeScript", "Inventory UI"],
    backend: ["Node.js", "PostgreSQL", "Barcode API"],
    color: "from-teal-600 to-cyan-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "billing-invoicing",
    name: "Billing & Invoicing",
    category: "Billing",
    masterCategory: "Retail & POS",
    description: "Professional billing with GST, invoices, quotations, and payment tracking.",
    url: "#",
    icon: Receipt,
    status: "COMING_SOON",
    features: ["GST Billing", "Invoices", "Quotations", "Payments"],
    frontend: ["React", "TypeScript", "Invoice UI"],
    backend: ["Node.js", "PostgreSQL", "PDF API"],
    color: "from-amber-600 to-orange-600",
    price: "₹29,999",
    discountPrice: "₹17,999"
  },

  // ============= 3. HEALTHCARE & MEDICAL SYSTEMS (7 Sub-categories) =============
  {
    id: "hospital-hms",
    name: "Hospital Management System",
    category: "Hospital HMS",
    masterCategory: "Healthcare",
    description: "Complete HMS with IPD, OPD, surgery, nursing, and department management.",
    url: "/demo/hospital-hms",
    icon: Building,
    status: "ACTIVE",
    features: ["IPD/OPD", "Surgery", "Nursing", "Departments"],
    frontend: ["React", "TypeScript", "Medical UI"],
    backend: ["Node.js", "PostgreSQL", "HL7 FHIR"],
    color: "from-emerald-600 to-teal-600",
    price: "₹99,999",
    discountPrice: "₹59,999"
  },
  {
    id: "clinic-management",
    name: "Clinic Management Software",
    category: "Clinic",
    masterCategory: "Healthcare",
    description: "Clinic software with patient records, prescriptions, billing, and scheduling.",
    url: "#",
    icon: Stethoscope,
    status: "COMING_SOON",
    features: ["Patient Records", "Prescriptions", "Billing", "Schedule"],
    frontend: ["React", "TypeScript", "Healthcare UI"],
    backend: ["Node.js", "PostgreSQL", "SMS API"],
    color: "from-teal-600 to-cyan-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
  },
  {
    id: "pharmacy-management",
    name: "Pharmacy Management",
    category: "Pharmacy",
    masterCategory: "Healthcare",
    description: "Pharmacy software with drug inventory, expiry tracking, billing, and prescriptions.",
    url: "#",
    icon: Pill,
    status: "COMING_SOON",
    features: ["Drug Inventory", "Expiry Track", "Billing", "Prescriptions"],
    frontend: ["React", "TypeScript", "Pharmacy UI"],
    backend: ["Node.js", "PostgreSQL", "Drug DB"],
    color: "from-green-600 to-emerald-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "lab-management",
    name: "Laboratory Management System",
    category: "Lab LIMS",
    masterCategory: "Healthcare",
    description: "LIMS with test management, sample tracking, report generation, and integration.",
    url: "#",
    icon: FlaskConical,
    status: "COMING_SOON",
    features: ["Test Mgmt", "Sample Track", "Reports", "Integration"],
    frontend: ["React", "TypeScript", "Lab UI"],
    backend: ["Node.js", "PostgreSQL", "HL7"],
    color: "from-purple-600 to-indigo-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
  },
  {
    id: "telemedicine",
    name: "Telemedicine Platform",
    category: "Telemedicine",
    masterCategory: "Healthcare",
    description: "Video consultation platform with scheduling, prescriptions, and payments.",
    url: "#",
    icon: Phone,
    status: "COMING_SOON",
    features: ["Video Call", "Scheduling", "E-Prescription", "Payments"],
    frontend: ["React", "TypeScript", "Video UI"],
    backend: ["Node.js", "PostgreSQL", "WebRTC"],
    color: "from-blue-600 to-cyan-600",
    price: "₹69,999",
    discountPrice: "₹41,999"
  },
  {
    id: "appointment-booking",
    name: "Appointment Booking System",
    category: "Appointments",
    masterCategory: "Healthcare",
    description: "Healthcare appointment system with doctor schedules, reminders, and queue management.",
    url: "#",
    icon: Calendar,
    status: "COMING_SOON",
    features: ["Doctor Schedule", "Reminders", "Queue Mgmt", "Check-in"],
    frontend: ["React", "TypeScript", "Booking UI"],
    backend: ["Node.js", "PostgreSQL", "SMS/Email"],
    color: "from-indigo-600 to-blue-600",
    price: "₹34,999",
    discountPrice: "₹20,999"
  },
  {
    id: "medical-records",
    name: "Medical Records Management",
    category: "EMR",
    masterCategory: "Healthcare",
    description: "Electronic medical records with patient history, documents, and secure sharing.",
    url: "#",
    icon: FileText,
    status: "COMING_SOON",
    features: ["Patient History", "Documents", "Secure Share", "Analytics"],
    frontend: ["React", "TypeScript", "EMR UI"],
    backend: ["Node.js", "PostgreSQL", "Encryption"],
    color: "from-rose-600 to-pink-600",
    price: "₹59,999",
    discountPrice: "₹35,999"
  },

  // ============= 4. LOGISTICS & TRANSPORTATION (7 Sub-categories) =============
  {
    id: "fleet-management",
    name: "Fleet Management System",
    category: "Fleet",
    masterCategory: "Logistics",
    description: "Fleet management with vehicle tracking, maintenance, fuel, and driver management.",
    url: "/demo/logistics",
    icon: Truck,
    status: "ACTIVE",
    features: ["Vehicle Track", "Maintenance", "Fuel Mgmt", "Drivers"],
    frontend: ["React", "TypeScript", "Maps UI"],
    backend: ["Node.js", "PostgreSQL", "GPS API"],
    color: "from-blue-600 to-indigo-600",
    price: "₹69,999",
    discountPrice: "₹41,999"
  },
  {
    id: "courier-management",
    name: "Courier Management Software",
    category: "Courier",
    masterCategory: "Logistics",
    description: "Courier software with AWB, tracking, hub management, and delivery proof.",
    url: "#",
    icon: Package,
    status: "COMING_SOON",
    features: ["AWB System", "Tracking", "Hub Mgmt", "POD"],
    frontend: ["React", "TypeScript", "Logistics UI"],
    backend: ["Node.js", "PostgreSQL", "Track API"],
    color: "from-orange-600 to-red-600",
    price: "₹59,999",
    discountPrice: "₹35,999"
  },
  {
    id: "delivery-management",
    name: "Delivery Management System",
    category: "Delivery",
    masterCategory: "Logistics",
    description: "Last-mile delivery with route optimization, rider app, and real-time tracking.",
    url: "#",
    icon: MapPin,
    status: "COMING_SOON",
    features: ["Route Optimize", "Rider App", "Real-time", "Proof"],
    frontend: ["React", "TypeScript", "Delivery UI"],
    backend: ["Node.js", "PostgreSQL", "Maps API"],
    color: "from-green-600 to-teal-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
  },
  {
    id: "transport-erp",
    name: "Transport ERP",
    category: "Transport ERP",
    masterCategory: "Logistics",
    description: "Complete transport ERP with booking, billing, LR, and accounts integration.",
    url: "#",
    icon: Truck,
    status: "COMING_SOON",
    features: ["Booking", "LR/GR", "Billing", "Accounts"],
    frontend: ["React", "TypeScript", "ERP UI"],
    backend: ["Node.js", "PostgreSQL", "GST API"],
    color: "from-purple-600 to-indigo-600",
    price: "₹79,999",
    discountPrice: "₹47,999"
  },
  {
    id: "route-trip",
    name: "Route & Trip Management",
    category: "Route Planning",
    masterCategory: "Logistics",
    description: "Route planning with trip scheduling, waypoints, ETAs, and cost optimization.",
    url: "#",
    icon: MapPin,
    status: "COMING_SOON",
    features: ["Route Plan", "Trip Schedule", "ETA", "Cost Optimize"],
    frontend: ["React", "TypeScript", "Maps UI"],
    backend: ["Node.js", "PostgreSQL", "Routing API"],
    color: "from-cyan-600 to-blue-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "driver-management",
    name: "Driver Management",
    category: "Driver Mgmt",
    masterCategory: "Logistics",
    description: "Driver management with documents, performance, payroll, and compliance tracking.",
    url: "#",
    icon: UserCheck,
    status: "COMING_SOON",
    features: ["Documents", "Performance", "Payroll", "Compliance"],
    frontend: ["React", "TypeScript", "HR UI"],
    backend: ["Node.js", "PostgreSQL", "Document API"],
    color: "from-amber-600 to-orange-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },
  {
    id: "gps-tracking",
    name: "GPS Tracking System",
    category: "GPS Tracking",
    masterCategory: "Logistics",
    description: "Real-time GPS tracking with geofencing, alerts, history, and reports.",
    url: "#",
    icon: MapPin,
    status: "COMING_SOON",
    features: ["Live Track", "Geofencing", "Alerts", "History"],
    frontend: ["React", "TypeScript", "Map UI"],
    backend: ["Node.js", "PostgreSQL", "GPS API"],
    color: "from-red-600 to-rose-600",
    price: "₹34,999",
    discountPrice: "₹20,999"
  },

  // ============= 5. REAL ESTATE & PROPERTY MANAGEMENT (7 Sub-categories) =============
  {
    id: "property-management",
    name: "Property Management System",
    category: "Property Mgmt",
    masterCategory: "Real Estate",
    description: "Property management with listings, tenants, leases, and maintenance tracking.",
    url: "/demo/real-estate",
    icon: Home,
    status: "ACTIVE",
    features: ["Listings", "Tenants", "Leases", "Maintenance"],
    frontend: ["React", "TypeScript", "Real Estate UI"],
    backend: ["Node.js", "PostgreSQL", "Document API"],
    color: "from-emerald-600 to-green-600",
    price: "₹59,999",
    discountPrice: "₹35,999"
  },
  {
    id: "realestate-crm",
    name: "Real Estate CRM",
    category: "Real Estate CRM",
    masterCategory: "Real Estate",
    description: "Real estate CRM with leads, site visits, follow-ups, and deal tracking.",
    url: "#",
    icon: Target,
    status: "COMING_SOON",
    features: ["Leads", "Site Visits", "Follow-ups", "Deals"],
    frontend: ["React", "TypeScript", "CRM UI"],
    backend: ["Node.js", "PostgreSQL", "Analytics"],
    color: "from-blue-600 to-indigo-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
  },
  {
    id: "society-management",
    name: "Society / Apartment Management",
    category: "Society Mgmt",
    masterCategory: "Real Estate",
    description: "Society management with maintenance, complaints, amenities, and visitor tracking.",
    url: "#",
    icon: Building,
    status: "COMING_SOON",
    features: ["Maintenance", "Complaints", "Amenities", "Visitors"],
    frontend: ["React", "TypeScript", "Society UI"],
    backend: ["Node.js", "PostgreSQL", "Payment API"],
    color: "from-purple-600 to-pink-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "rental-management",
    name: "Rental Management Software",
    category: "Rental Mgmt",
    masterCategory: "Real Estate",
    description: "Rental management with agreements, rent collection, and tenant communication.",
    url: "#",
    icon: Home,
    status: "COMING_SOON",
    features: ["Agreements", "Rent Collect", "Tenant Comm", "Reports"],
    frontend: ["React", "TypeScript", "Rental UI"],
    backend: ["Node.js", "PostgreSQL", "E-Sign API"],
    color: "from-teal-600 to-cyan-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },
  {
    id: "broker-agency",
    name: "Broker / Agency Management",
    category: "Broker Agency",
    masterCategory: "Real Estate",
    description: "Broker management with agent performance, commissions, and deal tracking.",
    url: "#",
    icon: Briefcase,
    status: "COMING_SOON",
    features: ["Agent Mgmt", "Commissions", "Deals", "Reports"],
    frontend: ["React", "TypeScript", "Agency UI"],
    backend: ["Node.js", "PostgreSQL", "Payout API"],
    color: "from-orange-600 to-amber-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
  },
  {
    id: "maintenance-mgmt",
    name: "Maintenance Management",
    category: "Maintenance",
    masterCategory: "Real Estate",
    description: "Property maintenance with work orders, vendors, scheduling, and cost tracking.",
    url: "#",
    icon: ClipboardCheck,
    status: "COMING_SOON",
    features: ["Work Orders", "Vendors", "Scheduling", "Costs"],
    frontend: ["React", "TypeScript", "Maintenance UI"],
    backend: ["Node.js", "PostgreSQL", "Notification API"],
    color: "from-gray-600 to-slate-600",
    price: "₹34,999",
    discountPrice: "₹20,999"
  },
  {
    id: "visitor-parking",
    name: "Visitor & Parking Management",
    category: "Visitor Parking",
    masterCategory: "Real Estate",
    description: "Visitor management with pre-registration, parking allocation, and access control.",
    url: "#",
    icon: Car,
    status: "COMING_SOON",
    features: ["Pre-Register", "Parking", "Access", "Logs"],
    frontend: ["React", "TypeScript", "Security UI"],
    backend: ["Node.js", "PostgreSQL", "Gate API"],
    color: "from-indigo-600 to-purple-600",
    price: "₹29,999",
    discountPrice: "₹17,999"
  },

  // ============= 6. FINANCE, BANKING & FINTECH (7 Sub-categories) =============
  {
    id: "digital-wallet",
    name: "Digital Wallet System",
    category: "Digital Wallet",
    masterCategory: "Finance",
    description: "Digital wallet with P2P transfers, bill payments, QR pay, and transaction history.",
    url: "/demo/finance",
    icon: Wallet,
    status: "ACTIVE",
    features: ["P2P Transfer", "Bill Pay", "QR Pay", "History"],
    frontend: ["React", "TypeScript", "FinTech UI"],
    backend: ["Node.js", "PostgreSQL", "Payment API"],
    color: "from-green-600 to-emerald-600",
    price: "₹89,999",
    discountPrice: "₹53,999"
  },
  {
    id: "banking-core",
    name: "Banking Core Software",
    category: "Core Banking",
    masterCategory: "Finance",
    description: "Core banking with accounts, transactions, interest calculation, and compliance.",
    url: "#",
    icon: Landmark,
    status: "COMING_SOON",
    features: ["Accounts", "Transactions", "Interest", "Compliance"],
    frontend: ["React", "TypeScript", "Banking UI"],
    backend: ["Node.js", "PostgreSQL", "Secure API"],
    color: "from-blue-600 to-indigo-600",
    price: "₹1,49,999",
    discountPrice: "₹89,999"
  },
  {
    id: "loan-management",
    name: "Loan Management System",
    category: "Loan Mgmt",
    masterCategory: "Finance",
    description: "Loan management with applications, disbursement, EMI, and collection tracking.",
    url: "#",
    icon: CreditCard,
    status: "COMING_SOON",
    features: ["Applications", "Disbursement", "EMI", "Collection"],
    frontend: ["React", "TypeScript", "Loan UI"],
    backend: ["Node.js", "PostgreSQL", "Credit API"],
    color: "from-purple-600 to-pink-600",
    price: "₹79,999",
    discountPrice: "₹47,999"
  },
  {
    id: "payment-gateway",
    name: "Payment Gateway Software",
    category: "Payment Gateway",
    masterCategory: "Finance",
    description: "Payment gateway with multi-currency, fraud detection, and merchant dashboard.",
    url: "#",
    icon: CreditCard,
    status: "COMING_SOON",
    features: ["Multi-Currency", "Fraud Detect", "Merchant", "Reports"],
    frontend: ["React", "TypeScript", "Payment UI"],
    backend: ["Node.js", "PostgreSQL", "PCI DSS"],
    color: "from-orange-600 to-red-600",
    price: "₹1,29,999",
    discountPrice: "₹77,999"
  },
  {
    id: "investment-mgmt",
    name: "Investment Management System",
    category: "Investment",
    masterCategory: "Finance",
    description: "Investment platform with portfolio, SIP, mutual funds, and performance tracking.",
    url: "#",
    icon: TrendingUp,
    status: "COMING_SOON",
    features: ["Portfolio", "SIP", "Mutual Funds", "Performance"],
    frontend: ["React", "TypeScript", "Investment UI"],
    backend: ["Node.js", "PostgreSQL", "Market API"],
    color: "from-teal-600 to-cyan-600",
    price: "₹99,999",
    discountPrice: "₹59,999"
  },
  {
    id: "emi-credit",
    name: "EMI & Credit Management",
    category: "EMI Credit",
    masterCategory: "Finance",
    description: "EMI management with credit scoring, payment scheduling, and overdue tracking.",
    url: "#",
    icon: Coins,
    status: "COMING_SOON",
    features: ["Credit Score", "EMI Schedule", "Overdue", "Recovery"],
    frontend: ["React", "TypeScript", "Credit UI"],
    backend: ["Node.js", "PostgreSQL", "Bureau API"],
    color: "from-amber-600 to-yellow-600",
    price: "₹69,999",
    discountPrice: "₹41,999"
  },
  {
    id: "kyc-verification",
    name: "KYC & Verification System",
    category: "KYC",
    masterCategory: "Finance",
    description: "KYC platform with document verification, face match, and compliance reporting.",
    url: "#",
    icon: UserCheck,
    status: "COMING_SOON",
    features: ["Document Verify", "Face Match", "Compliance", "Reports"],
    frontend: ["React", "TypeScript", "KYC UI"],
    backend: ["Node.js", "PostgreSQL", "AI Verify"],
    color: "from-rose-600 to-pink-600",
    price: "₹59,999",
    discountPrice: "₹35,999"
  },

  // ============= 7. ACCOUNTING, BILLING & TAXATION (7 Sub-categories) =============
  {
    id: "accounting-software",
    name: "Accounting Software",
    category: "Accounting",
    masterCategory: "Accounting",
    description: "Complete accounting with ledgers, journals, trial balance, and financial statements.",
    url: "#",
    icon: Calculator,
    status: "COMING_SOON",
    features: ["Ledgers", "Journals", "Trial Balance", "Statements"],
    frontend: ["React", "TypeScript", "Accounting UI"],
    backend: ["Node.js", "PostgreSQL", "Reports"],
    color: "from-blue-600 to-indigo-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
  },
  {
    id: "billing-software",
    name: "Billing & Invoicing Software",
    category: "Billing Invoice",
    masterCategory: "Accounting",
    description: "Professional invoicing with estimates, recurring bills, and payment reminders.",
    url: "#",
    icon: Receipt,
    status: "COMING_SOON",
    features: ["Invoices", "Estimates", "Recurring", "Reminders"],
    frontend: ["React", "TypeScript", "Invoice UI"],
    backend: ["Node.js", "PostgreSQL", "PDF API"],
    color: "from-green-600 to-teal-600",
    price: "₹29,999",
    discountPrice: "₹17,999"
  },
  {
    id: "gst-tax-software",
    name: "GST / VAT / Tax Software",
    category: "GST Tax",
    masterCategory: "Accounting",
    description: "Tax compliance with GST filing, returns, reconciliation, and e-invoicing.",
    url: "#",
    icon: FileText,
    status: "COMING_SOON",
    features: ["GST Filing", "Returns", "Reconciliation", "E-Invoice"],
    frontend: ["React", "TypeScript", "Tax UI"],
    backend: ["Node.js", "PostgreSQL", "GST API"],
    color: "from-purple-600 to-indigo-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },
  {
    id: "expense-management",
    name: "Expense Management System",
    category: "Expense Mgmt",
    masterCategory: "Accounting",
    description: "Expense tracking with receipt scanning, approvals, reimbursements, and reports.",
    url: "#",
    icon: DollarSign,
    status: "COMING_SOON",
    features: ["Receipt Scan", "Approvals", "Reimburse", "Reports"],
    frontend: ["React", "TypeScript", "Expense UI"],
    backend: ["Node.js", "PostgreSQL", "OCR API"],
    color: "from-orange-600 to-amber-600",
    price: "₹34,999",
    discountPrice: "₹20,999"
  },
  {
    id: "financial-reporting",
    name: "Financial Reporting Software",
    category: "Financial Reports",
    masterCategory: "Accounting",
    description: "Financial reporting with P&L, balance sheet, cash flow, and custom reports.",
    url: "#",
    icon: PieChart,
    status: "COMING_SOON",
    features: ["P&L", "Balance Sheet", "Cash Flow", "Custom"],
    frontend: ["React", "TypeScript", "Report UI"],
    backend: ["Node.js", "PostgreSQL", "Analytics"],
    color: "from-cyan-600 to-blue-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "audit-compliance",
    name: "Audit & Compliance Software",
    category: "Audit",
    masterCategory: "Accounting",
    description: "Audit management with checklists, findings, compliance tracking, and reports.",
    url: "#",
    icon: ClipboardCheck,
    status: "COMING_SOON",
    features: ["Checklists", "Findings", "Compliance", "Reports"],
    frontend: ["React", "TypeScript", "Audit UI"],
    backend: ["Node.js", "PostgreSQL", "Workflow"],
    color: "from-red-600 to-rose-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
  },
  {
    id: "multicurrency-accounting",
    name: "Multi-Currency Accounting",
    category: "Multi-Currency",
    masterCategory: "Accounting",
    description: "Multi-currency accounting with exchange rates, conversions, and consolidated reports.",
    url: "#",
    icon: Coins,
    status: "COMING_SOON",
    features: ["Exchange Rates", "Conversions", "Consolidated", "Reports"],
    frontend: ["React", "TypeScript", "Global UI"],
    backend: ["Node.js", "PostgreSQL", "Forex API"],
    color: "from-emerald-600 to-green-600",
    price: "₹59,999",
    discountPrice: "₹35,999"
  },

  // ============= 8. SALES, CRM & LEAD MANAGEMENT (7 Sub-categories) =============
  {
    id: "crm-software",
    name: "CRM Software",
    category: "CRM",
    masterCategory: "Sales & CRM",
    description: "Complete CRM with contacts, deals, activities, and customer 360° view.",
    url: "/demo/crm",
    icon: Users,
    status: "ACTIVE",
    features: ["Contacts", "Deals", "Activities", "360° View"],
    frontend: ["React", "TypeScript", "CRM UI"],
    backend: ["Node.js", "PostgreSQL", "Analytics"],
    color: "from-blue-600 to-purple-600",
    price: "₹59,999",
    discountPrice: "₹35,999"
  },
  {
    id: "lead-management",
    name: "Lead Management System",
    category: "Lead Mgmt",
    masterCategory: "Sales & CRM",
    description: "Lead management with capture, scoring, assignment, and conversion tracking.",
    url: "#",
    icon: Target,
    status: "COMING_SOON",
    features: ["Lead Capture", "Scoring", "Assignment", "Conversion"],
    frontend: ["React", "TypeScript", "Lead UI"],
    backend: ["Node.js", "PostgreSQL", "Integration"],
    color: "from-green-600 to-teal-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "sales-automation",
    name: "Sales Automation Software",
    category: "Sales Auto",
    masterCategory: "Sales & CRM",
    description: "Sales automation with workflows, sequences, templates, and task automation.",
    url: "#",
    icon: Zap,
    status: "COMING_SOON",
    features: ["Workflows", "Sequences", "Templates", "Tasks"],
    frontend: ["React", "TypeScript", "Auto UI"],
    backend: ["Node.js", "PostgreSQL", "Workflow Engine"],
    color: "from-orange-600 to-red-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
  },
  {
    id: "pipeline-deal",
    name: "Pipeline & Deal Management",
    category: "Pipeline",
    masterCategory: "Sales & CRM",
    description: "Sales pipeline with stages, deal tracking, forecasting, and win/loss analysis.",
    url: "#",
    icon: TrendingUp,
    status: "COMING_SOON",
    features: ["Pipeline", "Deal Track", "Forecast", "Analysis"],
    frontend: ["React", "TypeScript", "Pipeline UI"],
    backend: ["Node.js", "PostgreSQL", "Analytics"],
    color: "from-purple-600 to-pink-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },
  {
    id: "customer-database",
    name: "Customer Database Management",
    category: "Customer DB",
    masterCategory: "Sales & CRM",
    description: "Customer database with segmentation, tags, custom fields, and import/export.",
    url: "#",
    icon: Users,
    status: "COMING_SOON",
    features: ["Segments", "Tags", "Custom Fields", "Import/Export"],
    frontend: ["React", "TypeScript", "Data UI"],
    backend: ["Node.js", "PostgreSQL", "Bulk API"],
    color: "from-cyan-600 to-blue-600",
    price: "₹34,999",
    discountPrice: "₹20,999"
  },
  {
    id: "followup-reminder",
    name: "Follow-Up & Reminder System",
    category: "Follow-Up",
    masterCategory: "Sales & CRM",
    description: "Follow-up system with reminders, notifications, escalations, and activity logs.",
    url: "#",
    icon: Clock,
    status: "COMING_SOON",
    features: ["Reminders", "Notifications", "Escalations", "Logs"],
    frontend: ["React", "TypeScript", "Task UI"],
    backend: ["Node.js", "PostgreSQL", "Push API"],
    color: "from-amber-600 to-orange-600",
    price: "₹29,999",
    discountPrice: "₹17,999"
  },
  {
    id: "sales-reporting",
    name: "Sales Reporting & Analytics",
    category: "Sales Reports",
    masterCategory: "Sales & CRM",
    description: "Sales analytics with dashboards, KPIs, team performance, and custom reports.",
    url: "#",
    icon: BarChart3,
    status: "COMING_SOON",
    features: ["Dashboards", "KPIs", "Team Stats", "Reports"],
    frontend: ["React", "TypeScript", "Analytics UI"],
    backend: ["Node.js", "PostgreSQL", "BI Engine"],
    color: "from-indigo-600 to-purple-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },

  // ============= 9. MARKETING & ADVERTISING TECHNOLOGY (7 Sub-categories) =============
  {
    id: "digital-marketing",
    name: "Digital Marketing Platform",
    category: "Digital Marketing",
    masterCategory: "Marketing",
    description: "Digital marketing hub with SEO, SEM, content, and performance tracking.",
    url: "#",
    icon: Megaphone,
    status: "COMING_SOON",
    features: ["SEO Tools", "SEM", "Content", "Performance"],
    frontend: ["React", "TypeScript", "Marketing UI"],
    backend: ["Node.js", "PostgreSQL", "Analytics"],
    color: "from-pink-600 to-rose-600",
    price: "₹69,999",
    discountPrice: "₹41,999"
  },
  {
    id: "campaign-management",
    name: "Campaign Management Software",
    category: "Campaigns",
    masterCategory: "Marketing",
    description: "Campaign management with planning, execution, budget, and ROI tracking.",
    url: "#",
    icon: Target,
    status: "COMING_SOON",
    features: ["Planning", "Execution", "Budget", "ROI"],
    frontend: ["React", "TypeScript", "Campaign UI"],
    backend: ["Node.js", "PostgreSQL", "Ad API"],
    color: "from-purple-600 to-indigo-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
  },
  {
    id: "social-media-mgmt",
    name: "Social Media Management Tool",
    category: "Social Media",
    masterCategory: "Marketing",
    description: "Social media management with scheduling, publishing, engagement, and analytics.",
    url: "#",
    icon: Share2,
    status: "COMING_SOON",
    features: ["Scheduling", "Publishing", "Engagement", "Analytics"],
    frontend: ["React", "TypeScript", "Social UI"],
    backend: ["Node.js", "PostgreSQL", "Social API"],
    color: "from-blue-600 to-cyan-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },
  {
    id: "email-marketing",
    name: "Email Marketing Software",
    category: "Email Marketing",
    masterCategory: "Marketing",
    description: "Email marketing with templates, automation, A/B testing, and deliverability.",
    url: "#",
    icon: Mail,
    status: "COMING_SOON",
    features: ["Templates", "Automation", "A/B Test", "Deliverability"],
    frontend: ["React", "TypeScript", "Email UI"],
    backend: ["Node.js", "PostgreSQL", "SMTP"],
    color: "from-green-600 to-teal-600",
    price: "₹34,999",
    discountPrice: "₹20,999"
  },
  {
    id: "marketing-automation",
    name: "Marketing Automation System",
    category: "Marketing Auto",
    masterCategory: "Marketing",
    description: "Marketing automation with workflows, triggers, nurturing, and lead scoring.",
    url: "#",
    icon: Zap,
    status: "COMING_SOON",
    features: ["Workflows", "Triggers", "Nurturing", "Scoring"],
    frontend: ["React", "TypeScript", "Auto UI"],
    backend: ["Node.js", "PostgreSQL", "Workflow"],
    color: "from-orange-600 to-amber-600",
    price: "₹59,999",
    discountPrice: "₹35,999"
  },
  {
    id: "lead-attribution",
    name: "Lead Attribution Software",
    category: "Attribution",
    masterCategory: "Marketing",
    description: "Lead attribution with multi-touch, channel tracking, and conversion paths.",
    url: "#",
    icon: TrendingUp,
    status: "COMING_SOON",
    features: ["Multi-Touch", "Channels", "Conversion", "Reports"],
    frontend: ["React", "TypeScript", "Attribution UI"],
    backend: ["Node.js", "PostgreSQL", "Analytics"],
    color: "from-red-600 to-rose-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
  },
  {
    id: "marketing-analytics",
    name: "Marketing Analytics Platform",
    category: "Marketing Analytics",
    masterCategory: "Marketing",
    description: "Marketing analytics with dashboards, ROI, funnel analysis, and custom reports.",
    url: "#",
    icon: BarChart3,
    status: "COMING_SOON",
    features: ["Dashboards", "ROI", "Funnel", "Reports"],
    frontend: ["React", "TypeScript", "Analytics UI"],
    backend: ["Node.js", "PostgreSQL", "BI"],
    color: "from-indigo-600 to-blue-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },

  // ============= 10. HUMAN RESOURCE & PAYROLL SYSTEMS (7 Sub-categories) =============
  {
    id: "hrms-software",
    name: "HRMS Software",
    category: "HRMS",
    masterCategory: "HR & Payroll",
    description: "Complete HRMS with employee database, org chart, policies, and self-service.",
    url: "#",
    icon: Users,
    status: "COMING_SOON",
    features: ["Employee DB", "Org Chart", "Policies", "Self-Service"],
    frontend: ["React", "TypeScript", "HR UI"],
    backend: ["Node.js", "PostgreSQL", "Auth"],
    color: "from-violet-600 to-purple-600",
    price: "₹69,999",
    discountPrice: "₹41,999"
  },
  {
    id: "payroll-management",
    name: "Payroll Management System",
    category: "Payroll",
    masterCategory: "HR & Payroll",
    description: "Payroll processing with salary calculation, deductions, payslips, and compliance.",
    url: "#",
    icon: DollarSign,
    status: "COMING_SOON",
    features: ["Salary Calc", "Deductions", "Payslips", "Compliance"],
    frontend: ["React", "TypeScript", "Payroll UI"],
    backend: ["Node.js", "PostgreSQL", "Tax API"],
    color: "from-green-600 to-emerald-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
  },
  {
    id: "attendance-biometric",
    name: "Attendance & Biometric System",
    category: "Attendance",
    masterCategory: "HR & Payroll",
    description: "Attendance tracking with biometric, geo-fencing, shift management, and reports.",
    url: "#",
    icon: Fingerprint,
    status: "COMING_SOON",
    features: ["Biometric", "Geo-Fence", "Shifts", "Reports"],
    frontend: ["React", "TypeScript", "Attendance UI"],
    backend: ["Node.js", "PostgreSQL", "Device API"],
    color: "from-blue-600 to-indigo-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },
  {
    id: "leave-management",
    name: "Leave Management System",
    category: "Leave Mgmt",
    masterCategory: "HR & Payroll",
    description: "Leave management with policies, approvals, balance tracking, and holiday calendar.",
    url: "#",
    icon: Calendar,
    status: "COMING_SOON",
    features: ["Policies", "Approvals", "Balance", "Holidays"],
    frontend: ["React", "TypeScript", "Leave UI"],
    backend: ["Node.js", "PostgreSQL", "Workflow"],
    color: "from-teal-600 to-cyan-600",
    price: "₹29,999",
    discountPrice: "₹17,999"
  },
  {
    id: "recruitment-hiring",
    name: "Recruitment & Hiring Software",
    category: "Recruitment",
    masterCategory: "HR & Payroll",
    description: "ATS with job postings, applications, interviews, and offer management.",
    url: "#",
    icon: Briefcase,
    status: "COMING_SOON",
    features: ["Job Posts", "Applications", "Interviews", "Offers"],
    frontend: ["React", "TypeScript", "ATS UI"],
    backend: ["Node.js", "PostgreSQL", "Email API"],
    color: "from-orange-600 to-red-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "performance-management",
    name: "Performance Management System",
    category: "Performance",
    masterCategory: "HR & Payroll",
    description: "Performance management with goals, reviews, 360° feedback, and appraisals.",
    url: "#",
    icon: Award,
    status: "COMING_SOON",
    features: ["Goals", "Reviews", "360° Feedback", "Appraisals"],
    frontend: ["React", "TypeScript", "Performance UI"],
    backend: ["Node.js", "PostgreSQL", "Analytics"],
    color: "from-purple-600 to-pink-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },
  {
    id: "employee-selfservice",
    name: "Employee Self-Service Portal",
    category: "ESS Portal",
    masterCategory: "HR & Payroll",
    description: "Employee portal with profile, documents, requests, and communication.",
    url: "#",
    icon: UserCog,
    status: "COMING_SOON",
    features: ["Profile", "Documents", "Requests", "Communication"],
    frontend: ["React", "TypeScript", "Portal UI"],
    backend: ["Node.js", "PostgreSQL", "Auth"],
    color: "from-amber-600 to-yellow-600",
    price: "₹34,999",
    discountPrice: "₹20,999"
  },

  // ============= 11. ENTERPRISE RESOURCE PLANNING (ERP) (7 Sub-categories) =============
  {
    id: "manufacturing-erp",
    name: "Manufacturing ERP",
    category: "Manufacturing ERP",
    masterCategory: "ERP",
    description: "Complete manufacturing ERP with BOM, production planning, quality, and shop floor control.",
    url: "/demo/manufacturing",
    icon: Factory,
    status: "ACTIVE",
    features: ["BOM", "Production", "Quality", "Shop Floor"],
    frontend: ["React", "TypeScript", "ERP UI"],
    backend: ["Node.js", "PostgreSQL", "IoT Ready"],
    color: "from-slate-600 to-zinc-600",
    price: "₹1,49,999",
    discountPrice: "₹89,999"
  },
  {
    id: "trading-erp",
    name: "Trading ERP",
    category: "Trading ERP",
    masterCategory: "ERP",
    description: "Trading ERP with purchase, sales, inventory, and multi-location management.",
    url: "#",
    icon: TrendingUp,
    status: "COMING_SOON",
    features: ["Purchase", "Sales", "Inventory", "Multi-Location"],
    frontend: ["React", "TypeScript", "Trading UI"],
    backend: ["Node.js", "PostgreSQL", "Analytics"],
    color: "from-blue-600 to-indigo-600",
    price: "₹99,999",
    discountPrice: "₹59,999"
  },
  {
    id: "distribution-erp",
    name: "Distribution ERP",
    category: "Distribution ERP",
    masterCategory: "ERP",
    description: "Distribution ERP with order fulfillment, logistics, and channel management.",
    url: "#",
    icon: Truck,
    status: "COMING_SOON",
    features: ["Order Fulfillment", "Logistics", "Channel Mgmt", "Reports"],
    frontend: ["React", "TypeScript", "Distribution UI"],
    backend: ["Node.js", "PostgreSQL", "API Integration"],
    color: "from-green-600 to-teal-600",
    price: "₹1,19,999",
    discountPrice: "₹71,999"
  },
  {
    id: "service-erp",
    name: "Service Industry ERP",
    category: "Service ERP",
    masterCategory: "ERP",
    description: "Service ERP with project management, resource allocation, and billing.",
    url: "#",
    icon: Briefcase,
    status: "COMING_SOON",
    features: ["Projects", "Resources", "Billing", "Time Track"],
    frontend: ["React", "TypeScript", "Service UI"],
    backend: ["Node.js", "PostgreSQL", "Workflow"],
    color: "from-purple-600 to-pink-600",
    price: "₹89,999",
    discountPrice: "₹53,999"
  },
  {
    id: "multibranch-erp",
    name: "Multi-Branch ERP",
    category: "Multi-Branch ERP",
    masterCategory: "Enterprise Resource Planning (ERP)",
    description: "Multi-branch ERP with centralized control, branch sync, and consolidated reports.",
    url: "#",
    icon: Building,
    status: "COMING_SOON",
    features: ["Central Control", "Branch Sync", "Consolidated", "Access Control"],
    frontend: ["React", "TypeScript", "Enterprise UI"],
    backend: ["Node.js", "PostgreSQL", "Multi-tenant"],
    color: "from-orange-600 to-red-600",
    price: "₹1,29,999",
    discountPrice: "₹77,999"
  },
  {
    id: "inventory-purchase-erp",
    name: "Inventory & Purchase ERP",
    category: "Inventory ERP",
    masterCategory: "Enterprise Resource Planning (ERP)",
    description: "Inventory ERP with purchase orders, GRN, stock management, and vendor portal.",
    url: "#",
    icon: Package,
    status: "COMING_SOON",
    features: ["Purchase Orders", "GRN", "Stock Mgmt", "Vendor Portal"],
    frontend: ["React", "TypeScript", "Inventory UI"],
    backend: ["Node.js", "PostgreSQL", "Barcode API"],
    color: "from-cyan-600 to-blue-600",
    price: "₹79,999",
    discountPrice: "₹47,999"
  },
  {
    id: "finance-erp",
    name: "Finance-Integrated ERP",
    category: "Finance ERP",
    masterCategory: "Enterprise Resource Planning (ERP)",
    description: "Finance ERP with GL, AP/AR, budgeting, and financial consolidation.",
    url: "#",
    icon: Calculator,
    status: "COMING_SOON",
    features: ["GL", "AP/AR", "Budgeting", "Consolidation"],
    frontend: ["React", "TypeScript", "Finance UI"],
    backend: ["Node.js", "PostgreSQL", "Reporting"],
    color: "from-emerald-600 to-green-600",
    price: "₹1,09,999",
    discountPrice: "₹65,999"
  },

  // ============= 12. INVENTORY, WAREHOUSE & SUPPLY CHAIN (7 Sub-categories) =============
  {
    id: "inventory-management",
    name: "Inventory Management System",
    category: "Inventory Mgmt",
    masterCategory: "Inventory, Warehouse & Supply Chain",
    description: "Complete inventory with stock tracking, categories, locations, and alerts.",
    url: "#",
    icon: Package,
    status: "COMING_SOON",
    features: ["Stock Track", "Categories", "Locations", "Alerts"],
    frontend: ["React", "TypeScript", "Inventory UI"],
    backend: ["Node.js", "PostgreSQL", "Barcode"],
    color: "from-teal-600 to-cyan-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
  },
  {
    id: "warehouse-wms",
    name: "Warehouse Management System",
    category: "WMS",
    masterCategory: "Inventory, Warehouse & Supply Chain",
    description: "WMS with bin management, picking, packing, and shipment tracking.",
    url: "#",
    icon: Building,
    status: "COMING_SOON",
    features: ["Bin Mgmt", "Pick/Pack", "Shipment", "Labor"],
    frontend: ["React", "TypeScript", "WMS UI"],
    backend: ["Node.js", "PostgreSQL", "RF Devices"],
    color: "from-blue-600 to-indigo-600",
    price: "₹89,999",
    discountPrice: "₹53,999"
  },
  {
    id: "supply-chain-scm",
    name: "Supply Chain Management",
    category: "SCM",
    masterCategory: "Inventory, Warehouse & Supply Chain",
    description: "SCM with demand planning, procurement, logistics, and supplier collaboration.",
    url: "#",
    icon: Truck,
    status: "COMING_SOON",
    features: ["Demand Plan", "Procurement", "Logistics", "Collaboration"],
    frontend: ["React", "TypeScript", "SCM UI"],
    backend: ["Node.js", "PostgreSQL", "EDI"],
    color: "from-purple-600 to-pink-600",
    price: "₹1,19,999",
    discountPrice: "₹71,999"
  },
  {
    id: "stock-forecasting",
    name: "Stock Forecasting System",
    category: "Stock Forecast",
    masterCategory: "Inventory, Warehouse & Supply Chain",
    description: "AI-powered stock forecasting with trends, seasonality, and auto-replenishment.",
    url: "#",
    icon: TrendingUp,
    status: "COMING_SOON",
    features: ["AI Forecast", "Trends", "Seasonality", "Auto-Replenish"],
    frontend: ["React", "TypeScript", "Analytics UI"],
    backend: ["Node.js", "PostgreSQL", "ML Engine"],
    color: "from-green-600 to-emerald-600",
    price: "₹69,999",
    discountPrice: "₹41,999"
  },
  {
    id: "purchase-order",
    name: "Purchase Order Management",
    category: "Purchase Orders",
    masterCategory: "Inventory, Warehouse & Supply Chain",
    description: "PO management with approvals, receipts, invoices, and vendor management.",
    url: "#",
    icon: FileText,
    status: "COMING_SOON",
    features: ["PO Create", "Approvals", "Receipts", "Invoices"],
    frontend: ["React", "TypeScript", "PO UI"],
    backend: ["Node.js", "PostgreSQL", "Workflow"],
    color: "from-orange-600 to-amber-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "vendor-management",
    name: "Vendor Management System",
    category: "Vendor Mgmt",
    masterCategory: "Inventory, Warehouse & Supply Chain",
    description: "Vendor management with onboarding, performance, contracts, and payments.",
    url: "#",
    icon: Users,
    status: "COMING_SOON",
    features: ["Onboarding", "Performance", "Contracts", "Payments"],
    frontend: ["React", "TypeScript", "Vendor UI"],
    backend: ["Node.js", "PostgreSQL", "Document API"],
    color: "from-rose-600 to-red-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
  },
  {
    id: "barcode-rfid",
    name: "Barcode / RFID System",
    category: "Barcode RFID",
    masterCategory: "Inventory, Warehouse & Supply Chain",
    description: "Barcode & RFID tracking with label printing, scanning, and asset management.",
    url: "#",
    icon: Wifi,
    status: "COMING_SOON",
    features: ["Label Print", "Scanning", "RFID Track", "Assets"],
    frontend: ["React", "TypeScript", "Barcode UI"],
    backend: ["Node.js", "PostgreSQL", "Hardware API"],
    color: "from-gray-600 to-slate-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },

  // ============= 13. E-COMMERCE & ONLINE MARKETPLACES (7 Sub-categories) =============
  {
    id: "ecommerce-platform",
    name: "E-commerce Website Platform",
    category: "E-commerce Platform",
    masterCategory: "E-commerce & Online Marketplaces",
    description: "Complete e-commerce with catalog, cart, checkout, and customer management.",
    url: "/demo/ecommerce-store",
    icon: ShoppingBag,
    status: "ACTIVE",
    features: ["Catalog", "Cart", "Checkout", "Customer"],
    frontend: ["React", "TypeScript", "Store UI"],
    backend: ["Node.js", "PostgreSQL", "Payment API"],
    color: "from-purple-600 to-pink-600",
    price: "₹69,999",
    discountPrice: "₹41,999"
  },
  {
    id: "multivendor-marketplace",
    name: "Multi-Vendor Marketplace",
    category: "Marketplace",
    masterCategory: "E-commerce & Online Marketplaces",
    description: "Multi-vendor marketplace with seller dashboard, commissions, and reviews.",
    url: "#",
    icon: Store,
    status: "COMING_SOON",
    features: ["Seller Dashboard", "Commissions", "Reviews", "Disputes"],
    frontend: ["React", "TypeScript", "Marketplace UI"],
    backend: ["Node.js", "PostgreSQL", "Multi-tenant"],
    color: "from-blue-600 to-indigo-600",
    price: "₹1,29,999",
    discountPrice: "₹77,999"
  },
  {
    id: "b2b-ecommerce",
    name: "B2B E-commerce System",
    category: "B2B Commerce",
    masterCategory: "E-commerce & Online Marketplaces",
    description: "B2B e-commerce with bulk pricing, RFQ, credit terms, and corporate accounts.",
    url: "#",
    icon: Building,
    status: "COMING_SOON",
    features: ["Bulk Pricing", "RFQ", "Credit Terms", "Corporate"],
    frontend: ["React", "TypeScript", "B2B UI"],
    backend: ["Node.js", "PostgreSQL", "ERP Integration"],
    color: "from-green-600 to-teal-600",
    price: "₹99,999",
    discountPrice: "₹59,999"
  },
  {
    id: "subscription-commerce",
    name: "Subscription Commerce",
    category: "Subscription",
    masterCategory: "E-commerce & Online Marketplaces",
    description: "Subscription commerce with recurring billing, plans, and churn management.",
    url: "#",
    icon: Calendar,
    status: "COMING_SOON",
    features: ["Recurring Bill", "Plans", "Churn Mgmt", "Analytics"],
    frontend: ["React", "TypeScript", "Subscription UI"],
    backend: ["Node.js", "PostgreSQL", "Stripe API"],
    color: "from-orange-600 to-red-600",
    price: "₹79,999",
    discountPrice: "₹47,999"
  },
  {
    id: "order-management",
    name: "Order Management System",
    category: "Order Mgmt",
    masterCategory: "E-commerce & Online Marketplaces",
    description: "OMS with order routing, fulfillment, returns, and omnichannel support.",
    url: "#",
    icon: Package,
    status: "COMING_SOON",
    features: ["Order Route", "Fulfillment", "Returns", "Omnichannel"],
    frontend: ["React", "TypeScript", "OMS UI"],
    backend: ["Node.js", "PostgreSQL", "Shipping API"],
    color: "from-cyan-600 to-blue-600",
    price: "₹64,999",
    discountPrice: "₹38,999"
  },
  {
    id: "payment-checkout",
    name: "Payment & Checkout System",
    category: "Checkout",
    masterCategory: "E-commerce & Online Marketplaces",
    description: "Payment system with multi-gateway, fraud detection, and checkout optimization.",
    url: "#",
    icon: CreditCard,
    status: "COMING_SOON",
    features: ["Multi-Gateway", "Fraud Detect", "Optimize", "Reports"],
    frontend: ["React", "TypeScript", "Payment UI"],
    backend: ["Node.js", "PostgreSQL", "PCI DSS"],
    color: "from-emerald-600 to-green-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
  },
  {
    id: "seller-management",
    name: "Seller Management System",
    category: "Seller Mgmt",
    masterCategory: "E-commerce & Online Marketplaces",
    description: "Seller management with onboarding, verification, payouts, and performance.",
    url: "#",
    icon: UserCheck,
    status: "COMING_SOON",
    features: ["Onboarding", "Verification", "Payouts", "Performance"],
    frontend: ["React", "TypeScript", "Seller UI"],
    backend: ["Node.js", "PostgreSQL", "KYC API"],
    color: "from-amber-600 to-orange-600",
    price: "₹59,999",
    discountPrice: "₹35,999"
  },

  // ============= 14. HOSPITALITY (HOTEL, RESTAURANT, TRAVEL) (7 Sub-categories) =============
  {
    id: "hotel-management",
    name: "Hotel Management System",
    category: "Hotel HMS",
    masterCategory: "Hospitality (Hotel, Restaurant, Travel)",
    description: "Complete HMS with reservations, front desk, housekeeping, and revenue management.",
    url: "/demo/hotel-booking",
    icon: Hotel,
    status: "ACTIVE",
    features: ["Reservations", "Front Desk", "Housekeeping", "Revenue"],
    frontend: ["React", "TypeScript", "Hotel UI"],
    backend: ["Node.js", "PostgreSQL", "Channel Manager"],
    color: "from-amber-600 to-orange-600",
    price: "₹89,999",
    discountPrice: "₹53,999"
  },
  {
    id: "restaurant-management",
    name: "Restaurant Management System",
    category: "Restaurant Mgmt",
    masterCategory: "Hospitality (Hotel, Restaurant, Travel)",
    description: "Restaurant management with POS, kitchen, inventory, and customer loyalty.",
    url: "#",
    icon: Utensils,
    status: "COMING_SOON",
    features: ["POS", "Kitchen", "Inventory", "Loyalty"],
    frontend: ["React", "TypeScript", "Restaurant UI"],
    backend: ["Node.js", "PostgreSQL", "Real-time"],
    color: "from-red-600 to-orange-600",
    price: "₹64,999",
    discountPrice: "₹38,999"
  },
  {
    id: "travel-booking",
    name: "Travel Booking Software",
    category: "Travel Booking",
    masterCategory: "Hospitality (Hotel, Restaurant, Travel)",
    description: "Travel booking with packages, flights, hotels, and itinerary management.",
    url: "/demo/travel",
    icon: Plane,
    status: "ACTIVE",
    features: ["Packages", "Flights", "Hotels", "Itinerary"],
    frontend: ["React", "TypeScript", "Travel UI"],
    backend: ["Node.js", "PostgreSQL", "GDS API"],
    color: "from-sky-600 to-blue-600",
    price: "₹79,999",
    discountPrice: "₹47,999"
  },
  {
    id: "resort-management",
    name: "Resort Management System",
    category: "Resort Mgmt",
    masterCategory: "Hospitality (Hotel, Restaurant, Travel)",
    description: "Resort management with amenities, activities, spa, and guest experience.",
    url: "#",
    icon: Building,
    status: "COMING_SOON",
    features: ["Amenities", "Activities", "Spa", "Guest Exp"],
    frontend: ["React", "TypeScript", "Resort UI"],
    backend: ["Node.js", "PostgreSQL", "Booking API"],
    color: "from-green-600 to-teal-600",
    price: "₹99,999",
    discountPrice: "₹59,999"
  },
  {
    id: "room-reservation",
    name: "Room Reservation System",
    category: "Room Reserve",
    masterCategory: "Hospitality (Hotel, Restaurant, Travel)",
    description: "Room reservation with availability, rates, booking engine, and payments.",
    url: "#",
    icon: Calendar,
    status: "COMING_SOON",
    features: ["Availability", "Rates", "Booking Engine", "Payments"],
    frontend: ["React", "TypeScript", "Booking UI"],
    backend: ["Node.js", "PostgreSQL", "Payment API"],
    color: "from-purple-600 to-indigo-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
  },
  {
    id: "kitchen-order",
    name: "Kitchen Order Management",
    category: "Kitchen KOT",
    masterCategory: "Hospitality (Hotel, Restaurant, Travel)",
    description: "Kitchen order system with KOT, prep stations, timing, and order tracking.",
    url: "#",
    icon: Utensils,
    status: "COMING_SOON",
    features: ["KOT", "Prep Stations", "Timing", "Tracking"],
    frontend: ["React", "TypeScript", "Kitchen UI"],
    backend: ["Node.js", "PostgreSQL", "Real-time"],
    color: "from-orange-600 to-red-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },
  {
    id: "guest-experience",
    name: "Guest Experience Management",
    category: "Guest CX",
    masterCategory: "Hospitality (Hotel, Restaurant, Travel)",
    description: "Guest experience with feedback, preferences, loyalty, and personalization.",
    url: "#",
    icon: Star,
    status: "COMING_SOON",
    features: ["Feedback", "Preferences", "Loyalty", "Personalize"],
    frontend: ["React", "TypeScript", "CX UI"],
    backend: ["Node.js", "PostgreSQL", "AI Engine"],
    color: "from-rose-600 to-pink-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
  },

  // ============= 15. TELECOM, CALL CENTER & VOIP (7 Sub-categories) =============
  {
    id: "call-center",
    name: "Call Center Management Software",
    category: "Call Center",
    masterCategory: "Telecom, Call Center & VoIP",
    description: "Call center with ACD, queues, monitoring, and workforce management.",
    url: "/demo/telecom",
    icon: Headphones,
    status: "ACTIVE",
    features: ["ACD", "Queues", "Monitoring", "Workforce"],
    frontend: ["React", "TypeScript", "Call Center UI"],
    backend: ["Node.js", "PostgreSQL", "Telephony API"],
    color: "from-blue-600 to-indigo-600",
    price: "₹79,999",
    discountPrice: "₹47,999"
  },
  {
    id: "ivr-system",
    name: "IVR System",
    category: "IVR",
    masterCategory: "Telecom, Call Center & VoIP",
    description: "Interactive voice response with call flows, menus, and self-service.",
    url: "#",
    icon: Phone,
    status: "COMING_SOON",
    features: ["Call Flows", "Menus", "Self-Service", "Analytics"],
    frontend: ["React", "TypeScript", "IVR UI"],
    backend: ["Node.js", "PostgreSQL", "Voice API"],
    color: "from-green-600 to-teal-600",
    price: "₹59,999",
    discountPrice: "₹35,999"
  },
  {
    id: "voip-platform",
    name: "VoIP Calling Platform",
    category: "VoIP",
    masterCategory: "Telecom, Call Center & VoIP",
    description: "VoIP platform with SIP, WebRTC, call routing, and billing.",
    url: "#",
    icon: PhoneCall,
    status: "COMING_SOON",
    features: ["SIP", "WebRTC", "Routing", "Billing"],
    frontend: ["React", "TypeScript", "VoIP UI"],
    backend: ["Node.js", "PostgreSQL", "SIP Server"],
    color: "from-purple-600 to-pink-600",
    price: "₹89,999",
    discountPrice: "₹53,999"
  },
  {
    id: "call-recording",
    name: "Call Recording System",
    category: "Call Recording",
    masterCategory: "Telecom, Call Center & VoIP",
    description: "Call recording with storage, search, playback, and compliance.",
    url: "#",
    icon: Mic,
    status: "COMING_SOON",
    features: ["Recording", "Storage", "Search", "Compliance"],
    frontend: ["React", "TypeScript", "Recording UI"],
    backend: ["Node.js", "PostgreSQL", "Storage API"],
    color: "from-orange-600 to-red-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "callcenter-crm",
    name: "CRM for Call Centers",
    category: "CC CRM",
    masterCategory: "Telecom, Call Center & VoIP",
    description: "Call center CRM with customer info, history, scripts, and integration.",
    url: "#",
    icon: Users,
    status: "COMING_SOON",
    features: ["Customer Info", "History", "Scripts", "Integration"],
    frontend: ["React", "TypeScript", "CRM UI"],
    backend: ["Node.js", "PostgreSQL", "CTI"],
    color: "from-cyan-600 to-blue-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
  },
  {
    id: "dialer-software",
    name: "Dialer Software",
    category: "Dialer",
    masterCategory: "Telecom, Call Center & VoIP",
    description: "Auto dialer with predictive, progressive, and preview dialing modes.",
    url: "#",
    icon: Phone,
    status: "COMING_SOON",
    features: ["Predictive", "Progressive", "Preview", "DNC"],
    frontend: ["React", "TypeScript", "Dialer UI"],
    backend: ["Node.js", "PostgreSQL", "Dialer Engine"],
    color: "from-amber-600 to-orange-600",
    price: "₹69,999",
    discountPrice: "₹41,999"
  },
  {
    id: "agent-performance",
    name: "Agent Performance System",
    category: "Agent Perf",
    masterCategory: "Telecom, Call Center & VoIP",
    description: "Agent performance with KPIs, scorecards, coaching, and gamification.",
    url: "#",
    icon: Award,
    status: "COMING_SOON",
    features: ["KPIs", "Scorecards", "Coaching", "Gamification"],
    frontend: ["React", "TypeScript", "Performance UI"],
    backend: ["Node.js", "PostgreSQL", "Analytics"],
    color: "from-emerald-600 to-green-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
  },

  // ============= 16. CUSTOMER SUPPORT & HELPDESK (7 Sub-categories) =============
  {
    id: "ticket-management",
    name: "Ticket Management System",
    category: "Ticketing",
    masterCategory: "Customer Support & Helpdesk",
    description: "Ticket system with creation, assignment, escalation, and resolution tracking.",
    url: "#",
    icon: ClipboardCheck,
    status: "COMING_SOON",
    features: ["Tickets", "Assignment", "Escalation", "Resolution"],
    frontend: ["React", "TypeScript", "Helpdesk UI"],
    backend: ["Node.js", "PostgreSQL", "Workflow"],
    color: "from-blue-600 to-purple-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
  },
  {
    id: "helpdesk-software",
    name: "Helpdesk Software",
    category: "Helpdesk",
    masterCategory: "Customer Support & Helpdesk",
    description: "Helpdesk with multi-channel support, automation, and customer portal.",
    url: "#",
    icon: Headphones,
    status: "COMING_SOON",
    features: ["Multi-Channel", "Automation", "Portal", "Reports"],
    frontend: ["React", "TypeScript", "Support UI"],
    backend: ["Node.js", "PostgreSQL", "Email API"],
    color: "from-green-600 to-teal-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
  },
  {
    id: "live-chat",
    name: "Live Chat System",
    category: "Live Chat",
    masterCategory: "Customer Support & Helpdesk",
    description: "Live chat with real-time messaging, chatbots, and visitor tracking.",
    url: "#",
    icon: MessageSquare,
    status: "COMING_SOON",
    features: ["Real-time", "Chatbots", "Visitors", "Transcripts"],
    frontend: ["React", "TypeScript", "Chat UI"],
    backend: ["Node.js", "PostgreSQL", "WebSocket"],
    color: "from-purple-600 to-pink-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },
  {
    id: "customer-feedback",
    name: "Customer Feedback System",
    category: "Feedback",
    masterCategory: "Customer Support & Helpdesk",
    description: "Feedback system with surveys, NPS, CSAT, and sentiment analysis.",
    url: "#",
    icon: Star,
    status: "COMING_SOON",
    features: ["Surveys", "NPS", "CSAT", "Sentiment"],
    frontend: ["React", "TypeScript", "Feedback UI"],
    backend: ["Node.js", "PostgreSQL", "AI Analysis"],
    color: "from-orange-600 to-amber-600",
    price: "₹34,999",
    discountPrice: "₹20,999"
  },
  {
    id: "sla-management",
    name: "SLA Management Software",
    category: "SLA Mgmt",
    masterCategory: "Customer Support & Helpdesk",
    description: "SLA management with policies, tracking, alerts, and compliance reports.",
    url: "#",
    icon: Clock,
    status: "COMING_SOON",
    features: ["Policies", "Tracking", "Alerts", "Compliance"],
    frontend: ["React", "TypeScript", "SLA UI"],
    backend: ["Node.js", "PostgreSQL", "Scheduler"],
    color: "from-red-600 to-rose-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base System",
    category: "Knowledge Base",
    masterCategory: "Customer Support & Helpdesk",
    description: "Knowledge base with articles, categories, search, and self-service portal.",
    url: "#",
    icon: BookOpen,
    status: "COMING_SOON",
    features: ["Articles", "Categories", "Search", "Self-Service"],
    frontend: ["React", "TypeScript", "KB UI"],
    backend: ["Node.js", "PostgreSQL", "Full-text Search"],
    color: "from-cyan-600 to-blue-600",
    price: "₹29,999",
    discountPrice: "₹17,999"
  },
  {
    id: "omnichannel-support",
    name: "Omnichannel Support Platform",
    category: "Omnichannel",
    masterCategory: "Customer Support & Helpdesk",
    description: "Omnichannel support with email, chat, phone, and social integration.",
    url: "#",
    icon: Globe,
    status: "COMING_SOON",
    features: ["Email", "Chat", "Phone", "Social"],
    frontend: ["React", "TypeScript", "Omni UI"],
    backend: ["Node.js", "PostgreSQL", "Channel APIs"],
    color: "from-indigo-600 to-purple-600",
    price: "₹69,999",
    discountPrice: "₹41,999"
  },

  // ============= 17. LEGAL, COMPLIANCE & DOCUMENTATION (7 Sub-categories) =============
  {
    id: "legal-case",
    name: "Legal Case Management System",
    category: "Legal Case",
    masterCategory: "Legal, Compliance & Documentation",
    description: "Legal case management with matters, documents, billing, and deadlines.",
    url: "/demo/legal",
    icon: Scale,
    status: "ACTIVE",
    features: ["Matters", "Documents", "Billing", "Deadlines"],
    frontend: ["React", "TypeScript", "Legal UI"],
    backend: ["Node.js", "PostgreSQL", "Document API"],
    color: "from-slate-600 to-zinc-600",
    price: "₹79,999",
    discountPrice: "₹47,999"
  },
  {
    id: "contract-management",
    name: "Contract Management Software",
    category: "Contracts",
    masterCategory: "Legal, Compliance & Documentation",
    description: "Contract management with drafting, approvals, signatures, and renewals.",
    url: "#",
    icon: FileText,
    status: "COMING_SOON",
    features: ["Drafting", "Approvals", "Signatures", "Renewals"],
    frontend: ["React", "TypeScript", "Contract UI"],
    backend: ["Node.js", "PostgreSQL", "E-Sign API"],
    color: "from-blue-600 to-indigo-600",
    price: "₹59,999",
    discountPrice: "₹35,999"
  },
  {
    id: "compliance-management",
    name: "Compliance Management System",
    category: "Compliance",
    masterCategory: "Legal, Compliance & Documentation",
    description: "Compliance management with regulations, audits, and risk assessment.",
    url: "#",
    icon: ClipboardCheck,
    status: "COMING_SOON",
    features: ["Regulations", "Audits", "Risk", "Reports"],
    frontend: ["React", "TypeScript", "Compliance UI"],
    backend: ["Node.js", "PostgreSQL", "Workflow"],
    color: "from-green-600 to-teal-600",
    price: "₹69,999",
    discountPrice: "₹41,999"
  },
  {
    id: "document-dms",
    name: "Document Management System",
    category: "DMS",
    masterCategory: "Legal, Compliance & Documentation",
    description: "DMS with storage, versioning, permissions, and full-text search.",
    url: "#",
    icon: FileText,
    status: "COMING_SOON",
    features: ["Storage", "Versioning", "Permissions", "Search"],
    frontend: ["React", "TypeScript", "DMS UI"],
    backend: ["Node.js", "PostgreSQL", "Cloud Storage"],
    color: "from-purple-600 to-pink-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
  },
  {
    id: "esignature",
    name: "E-Signature Software",
    category: "E-Signature",
    masterCategory: "Legal, Compliance & Documentation",
    description: "E-signature with document signing, templates, and audit trails.",
    url: "#",
    icon: FileCheck,
    status: "COMING_SOON",
    features: ["Signing", "Templates", "Audit Trail", "Compliance"],
    frontend: ["React", "TypeScript", "Sign UI"],
    backend: ["Node.js", "PostgreSQL", "Crypto API"],
    color: "from-orange-600 to-red-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "policy-management",
    name: "Policy Management System",
    category: "Policy Mgmt",
    masterCategory: "Legal, Compliance & Documentation",
    description: "Policy management with creation, approval, distribution, and acknowledgment.",
    url: "#",
    icon: ScrollText,
    status: "COMING_SOON",
    features: ["Creation", "Approval", "Distribution", "Acknowledge"],
    frontend: ["React", "TypeScript", "Policy UI"],
    backend: ["Node.js", "PostgreSQL", "Workflow"],
    color: "from-cyan-600 to-blue-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },
  {
    id: "legal-notice",
    name: "Legal Notice Tracking System",
    category: "Legal Notice",
    masterCategory: "Legal, Compliance & Documentation",
    description: "Legal notice tracking with creation, delivery, responses, and deadlines.",
    url: "#",
    icon: Gavel,
    status: "COMING_SOON",
    features: ["Create", "Delivery", "Responses", "Deadlines"],
    frontend: ["React", "TypeScript", "Notice UI"],
    backend: ["Node.js", "PostgreSQL", "Email API"],
    color: "from-amber-600 to-orange-600",
    price: "₹34,999",
    discountPrice: "₹20,999"
  },

  // ============= 18. GOVERNMENT & E-GOVERNANCE SYSTEMS (7 Sub-categories) =============
  {
    id: "citizen-portal",
    name: "Citizen Service Portal",
    category: "Citizen Portal",
    masterCategory: "Government & e-Governance Systems",
    description: "Citizen portal with services, applications, payments, and tracking.",
    url: "#",
    icon: Building2,
    status: "COMING_SOON",
    features: ["Services", "Applications", "Payments", "Tracking"],
    frontend: ["React", "TypeScript", "Gov UI"],
    backend: ["Node.js", "PostgreSQL", "Gov API"],
    color: "from-blue-600 to-indigo-600",
    price: "₹1,29,999",
    discountPrice: "₹77,999"
  },
  {
    id: "government-erp",
    name: "Government ERP",
    category: "Gov ERP",
    masterCategory: "Government & e-Governance Systems",
    description: "Government ERP with departments, budgets, procurement, and HR.",
    url: "#",
    icon: Landmark,
    status: "COMING_SOON",
    features: ["Departments", "Budgets", "Procurement", "HR"],
    frontend: ["React", "TypeScript", "ERP UI"],
    backend: ["Node.js", "PostgreSQL", "Multi-dept"],
    color: "from-green-600 to-teal-600",
    price: "₹1,99,999",
    discountPrice: "₹1,19,999"
  },
  {
    id: "digital-document",
    name: "Digital Document Services",
    category: "Digital Docs",
    masterCategory: "Government & e-Governance Systems",
    description: "Digital documents with issuance, verification, and blockchain integration.",
    url: "#",
    icon: FileText,
    status: "COMING_SOON",
    features: ["Issuance", "Verification", "Blockchain", "Archive"],
    frontend: ["React", "TypeScript", "Doc UI"],
    backend: ["Node.js", "PostgreSQL", "Blockchain"],
    color: "from-purple-600 to-pink-600",
    price: "₹89,999",
    discountPrice: "₹53,999"
  },
  {
    id: "online-application",
    name: "Online Application System",
    category: "Online App",
    masterCategory: "Government & e-Governance Systems",
    description: "Online applications with forms, documents, fees, and status tracking.",
    url: "#",
    icon: FileText,
    status: "COMING_SOON",
    features: ["Forms", "Documents", "Fees", "Status"],
    frontend: ["React", "TypeScript", "App UI"],
    backend: ["Node.js", "PostgreSQL", "Workflow"],
    color: "from-orange-600 to-red-600",
    price: "₹69,999",
    discountPrice: "₹41,999"
  },
  {
    id: "grievance-management",
    name: "Grievance Management System",
    category: "Grievance",
    masterCategory: "Government & e-Governance Systems",
    description: "Grievance management with complaints, escalation, and resolution tracking.",
    url: "#",
    icon: Vote,
    status: "COMING_SOON",
    features: ["Complaints", "Escalation", "Resolution", "Reports"],
    frontend: ["React", "TypeScript", "Grievance UI"],
    backend: ["Node.js", "PostgreSQL", "Workflow"],
    color: "from-cyan-600 to-blue-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
  },
  {
    id: "smart-city",
    name: "Smart City Platform",
    category: "Smart City",
    masterCategory: "Government & e-Governance Systems",
    description: "Smart city platform with IoT, traffic, utilities, and citizen engagement.",
    url: "#",
    icon: Lightbulb,
    status: "COMING_SOON",
    features: ["IoT", "Traffic", "Utilities", "Engagement"],
    frontend: ["React", "TypeScript", "Smart UI"],
    backend: ["Node.js", "PostgreSQL", "IoT Platform"],
    color: "from-emerald-600 to-green-600",
    price: "₹2,49,999",
    discountPrice: "₹1,49,999"
  },
  {
    id: "public-finance",
    name: "Public Finance Management",
    category: "Public Finance",
    masterCategory: "Government & e-Governance Systems",
    description: "Public finance with budget planning, expenditure, and treasury management.",
    url: "#",
    icon: DollarSign,
    status: "COMING_SOON",
    features: ["Budget", "Expenditure", "Treasury", "Reports"],
    frontend: ["React", "TypeScript", "Finance UI"],
    backend: ["Node.js", "PostgreSQL", "Integration"],
    color: "from-amber-600 to-yellow-600",
    price: "₹1,49,999",
    discountPrice: "₹89,999"
  },

  // ============= 19. SECURITY, SURVEILLANCE & ACCESS CONTROL (7 Sub-categories) =============
  {
    id: "cctv-monitoring",
    name: "CCTV Monitoring Software",
    category: "CCTV",
    masterCategory: "Security, Surveillance & Access Control",
    description: "CCTV monitoring with live view, recording, playback, and AI analytics.",
    url: "/demo/security",
    icon: Camera,
    status: "ACTIVE",
    features: ["Live View", "Recording", "Playback", "AI Analytics"],
    frontend: ["React", "TypeScript", "Surveillance UI"],
    backend: ["Node.js", "PostgreSQL", "Video API"],
    color: "from-slate-600 to-gray-600",
    price: "₹69,999",
    discountPrice: "₹41,999"
  },
  {
    id: "access-control",
    name: "Access Control System",
    category: "Access Control",
    masterCategory: "Security, Surveillance & Access Control",
    description: "Access control with card readers, biometric, schedules, and audit logs.",
    url: "#",
    icon: Key,
    status: "COMING_SOON",
    features: ["Card Readers", "Biometric", "Schedules", "Audit"],
    frontend: ["React", "TypeScript", "Access UI"],
    backend: ["Node.js", "PostgreSQL", "Hardware API"],
    color: "from-blue-600 to-indigo-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
  },
  {
    id: "visitor-mgmt-security",
    name: "Visitor Management System",
    category: "Visitor Mgmt",
    masterCategory: "Security, Surveillance & Access Control",
    description: "Visitor management with registration, badges, approvals, and tracking.",
    url: "#",
    icon: UserCheck,
    status: "COMING_SOON",
    features: ["Registration", "Badges", "Approvals", "Tracking"],
    frontend: ["React", "TypeScript", "Visitor UI"],
    backend: ["Node.js", "PostgreSQL", "Print API"],
    color: "from-green-600 to-teal-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },
  {
    id: "biometric-attendance",
    name: "Biometric Attendance System",
    category: "Biometric Attend",
    masterCategory: "Security, Surveillance & Access Control",
    description: "Biometric attendance with fingerprint, face, and integration with HR.",
    url: "#",
    icon: Fingerprint,
    status: "COMING_SOON",
    features: ["Fingerprint", "Face", "Integration", "Reports"],
    frontend: ["React", "TypeScript", "Biometric UI"],
    backend: ["Node.js", "PostgreSQL", "Device API"],
    color: "from-purple-600 to-pink-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "security-patrol",
    name: "Security Patrol System",
    category: "Patrol",
    masterCategory: "Security, Surveillance & Access Control",
    description: "Security patrol with checkpoints, GPS, incidents, and real-time tracking.",
    url: "#",
    icon: Shield,
    status: "COMING_SOON",
    features: ["Checkpoints", "GPS", "Incidents", "Real-time"],
    frontend: ["React", "TypeScript", "Patrol UI"],
    backend: ["Node.js", "PostgreSQL", "GPS API"],
    color: "from-orange-600 to-red-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
  },
  {
    id: "alarm-monitoring",
    name: "Alarm Monitoring Software",
    category: "Alarm",
    masterCategory: "Security, Surveillance & Access Control",
    description: "Alarm monitoring with zones, alerts, response, and integration.",
    url: "#",
    icon: AlertTriangle,
    status: "COMING_SOON",
    features: ["Zones", "Alerts", "Response", "Integration"],
    frontend: ["React", "TypeScript", "Alarm UI"],
    backend: ["Node.js", "PostgreSQL", "Alarm API"],
    color: "from-red-600 to-rose-600",
    price: "₹59,999",
    discountPrice: "₹35,999"
  },
  {
    id: "incident-reporting",
    name: "Incident Reporting System",
    category: "Incident",
    masterCategory: "Security, Surveillance & Access Control",
    description: "Incident reporting with forms, photos, investigation, and analytics.",
    url: "#",
    icon: FileText,
    status: "COMING_SOON",
    features: ["Forms", "Photos", "Investigation", "Analytics"],
    frontend: ["React", "TypeScript", "Incident UI"],
    backend: ["Node.js", "PostgreSQL", "Storage API"],
    color: "from-amber-600 to-orange-600",
    price: "₹34,999",
    discountPrice: "₹20,999"
  },

  // ============= 20. CYBER SECURITY & DATA PROTECTION (7 Sub-categories) =============
  {
    id: "endpoint-security",
    name: "Endpoint Security Software",
    category: "Endpoint",
    masterCategory: "Cyber Security & Data Protection",
    description: "Endpoint security with antivirus, threat detection, and device management.",
    url: "#",
    icon: Shield,
    status: "COMING_SOON",
    features: ["Antivirus", "Threat Detect", "Device Mgmt", "Reports"],
    frontend: ["React", "TypeScript", "Security UI"],
    backend: ["Node.js", "PostgreSQL", "Agent API"],
    color: "from-red-600 to-rose-600",
    price: "₹89,999",
    discountPrice: "₹53,999"
  },
  {
    id: "firewall-management",
    name: "Firewall Management System",
    category: "Firewall",
    masterCategory: "Cyber Security & Data Protection",
    description: "Firewall management with rules, policies, logs, and threat analytics.",
    url: "#",
    icon: Lock,
    status: "COMING_SOON",
    features: ["Rules", "Policies", "Logs", "Analytics"],
    frontend: ["React", "TypeScript", "Firewall UI"],
    backend: ["Node.js", "PostgreSQL", "Network API"],
    color: "from-blue-600 to-indigo-600",
    price: "₹79,999",
    discountPrice: "₹47,999"
  },
  {
    id: "siem-soc",
    name: "SIEM / SOC Platform",
    category: "SIEM SOC",
    masterCategory: "Cyber Security & Data Protection",
    description: "SIEM platform with log collection, correlation, alerts, and incident response.",
    url: "#",
    icon: MonitorPlay,
    status: "COMING_SOON",
    features: ["Log Collect", "Correlation", "Alerts", "Response"],
    frontend: ["React", "TypeScript", "SIEM UI"],
    backend: ["Node.js", "PostgreSQL", "Big Data"],
    color: "from-purple-600 to-pink-600",
    price: "₹1,99,999",
    discountPrice: "₹1,19,999"
  },
  {
    id: "identity-access",
    name: "Identity & Access Management",
    category: "IAM",
    masterCategory: "Cyber Security & Data Protection",
    description: "IAM with SSO, MFA, provisioning, and access governance.",
    url: "#",
    icon: Key,
    status: "COMING_SOON",
    features: ["SSO", "MFA", "Provisioning", "Governance"],
    frontend: ["React", "TypeScript", "IAM UI"],
    backend: ["Node.js", "PostgreSQL", "LDAP/SAML"],
    color: "from-green-600 to-teal-600",
    price: "₹1,29,999",
    discountPrice: "₹77,999"
  },
  {
    id: "data-loss-prevention",
    name: "Data Loss Prevention",
    category: "DLP",
    masterCategory: "Cyber Security & Data Protection",
    description: "DLP with content inspection, policy enforcement, and incident management.",
    url: "#",
    icon: Eye,
    status: "COMING_SOON",
    features: ["Inspection", "Policies", "Incidents", "Reports"],
    frontend: ["React", "TypeScript", "DLP UI"],
    backend: ["Node.js", "PostgreSQL", "ML Engine"],
    color: "from-orange-600 to-red-600",
    price: "₹1,09,999",
    discountPrice: "₹65,999"
  },
  {
    id: "backup-recovery",
    name: "Backup & Disaster Recovery",
    category: "Backup DR",
    masterCategory: "Cyber Security & Data Protection",
    description: "Backup and DR with scheduling, replication, and recovery testing.",
    url: "#",
    icon: HardDrive,
    status: "COMING_SOON",
    features: ["Scheduling", "Replication", "Recovery", "Testing"],
    frontend: ["React", "TypeScript", "Backup UI"],
    backend: ["Node.js", "PostgreSQL", "Storage API"],
    color: "from-cyan-600 to-blue-600",
    price: "₹69,999",
    discountPrice: "₹41,999"
  },
  {
    id: "vulnerability-mgmt",
    name: "Vulnerability Management System",
    category: "Vuln Mgmt",
    masterCategory: "Cyber Security & Data Protection",
    description: "Vulnerability management with scanning, assessment, and remediation tracking.",
    url: "#",
    icon: AlertTriangle,
    status: "COMING_SOON",
    features: ["Scanning", "Assessment", "Remediation", "Reports"],
    frontend: ["React", "TypeScript", "Vuln UI"],
    backend: ["Node.js", "PostgreSQL", "Scanner API"],
    color: "from-amber-600 to-yellow-600",
    price: "₹99,999",
    discountPrice: "₹59,999"
  }
];

// Master Categories for filtering (20 Categories)
const masterCategories = [
  "All",
  "Education",
  "Retail & POS",
  "Healthcare",
  "Logistics",
  "Real Estate",
  "Finance",
  "Accounting",
  "Sales & CRM",
  "Marketing",
  "HR & Payroll",
  "ERP",
  "Inventory",
  "E-commerce",
  "Hospitality",
  "Telecom",
  "Support",
  "Legal",
  "Government",
  "Security",
  "Cyber Security"
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredDemos = allDemos.filter(demo => {
    const matchesCategory = activeCategory === "All" || demo.masterCategory === activeCategory;
    const matchesSearch = demo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          demo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          demo.masterCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  // Count demos per master category
  const getCategoryCount = (category: string) => {
    if (category === "All") return allDemos.length;
    return allDemos.filter(d => d.masterCategory === category).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1e36] to-[#0a1628]">
      {/* Premium Header */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 py-4 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <img src={softwareValaLogo} alt="Software Vala" className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-lg" />
              <div>
                <h1 className="text-white font-bold text-2xl">Software Vala</h1>
                <p className="text-white/90 text-sm">- The Name of Trust</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {/* Career Portal Buttons */}
              <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700 text-white gap-1 text-xs">
                <Link to="/careers?type=developer">
                  <Code2 className="h-3 w-3" />
                  Join as Developer
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-pink-600 hover:bg-pink-700 text-white gap-1 text-xs">
                <Link to="/careers?type=influencer">
                  <Megaphone className="h-3 w-3" />
                  Become Influencer
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white gap-1 text-xs">
                <Link to="/careers?type=job">
                  <Briefcase className="h-3 w-3" />
                  Apply for Job
                </Link>
              </Button>
              {/* Pricing Badge */}
              <Badge className="bg-white text-green-600 font-bold text-sm px-3 py-1.5 animate-pulse">
                💰 $249 Lifetime
              </Badge>
              <Badge className="bg-white/20 text-white border-0 text-xs px-3 py-1.5">
                🎉 40% OFF
              </Badge>
              {/* Login Button - For regular users */}
              <Button asChild className="bg-white text-orange-600 hover:bg-white/90 font-bold gap-2">
                <Link to="/auth">
                  <Lock className="h-4 w-4" />
                  Login
                </Link>
              </Button>
              {/* Temporary Boss Portal Access - Remove after 2-3 days */}
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold gap-2 shadow-lg shadow-purple-500/30"
              >
                <Link to="/boss/login">
                  <Shield className="h-4 w-4" />
                  Boss Portal
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-[#0d1e36] to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-4">
              <Star className="h-3 w-3 mr-1" /> 20 Master Categories • 147 Software Solutions • 20 Live Demos
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Business Software</span> Marketplace
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
              Premium enterprise solutions across Education, Healthcare, Finance, Retail, Logistics & more.
              Start your business today with our ready-to-deploy software!
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="h-5 w-5" /> Full Source Code
              </div>
              <div className="flex items-center gap-2 text-cyan-400">
                <CheckCircle className="h-5 w-5" /> 1 Year Free Support
              </div>
              <div className="flex items-center gap-2 text-orange-400">
                <CheckCircle className="h-5 w-5" /> Free Installation
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <CheckCircle className="h-5 w-5" /> Lifetime Updates
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter - Master Categories */}
      <div className="bg-[#0d1e36]/80 backdrop-blur-sm border-b border-cyan-500/20 py-4 px-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search software..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1a2d4a] border-cyan-500/30 text-white placeholder:text-gray-400"
              />
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              {filteredDemos.length} Products
            </Badge>
          </div>
          <div className="flex gap-2 flex-wrap">
            {masterCategories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className={activeCategory === cat 
                  ? "bg-cyan-500 text-white hover:bg-cyan-600" 
                  : "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200"
                }
              >
                {cat === "All" ? `All (${getCategoryCount(cat)})` : cat}
                {cat !== "All" && (
                  <span className="ml-1 text-xs opacity-70">({getCategoryCount(cat)})</span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Cards Grid */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Group by Master Category when "All" is selected */}
          {activeCategory === "All" ? (
            masterCategories.slice(1).map(masterCat => {
              const categoryDemos = filteredDemos.filter(d => d.masterCategory === masterCat);
              if (categoryDemos.length === 0) return null;
              
              return (
                <div key={masterCat} className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-2xl font-bold text-white">{masterCat}</h3>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                      {categoryDemos.length} Products
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryDemos.map((demo, index) => (
                      <DemoCard 
                        key={demo.id} 
                        demo={demo} 
                        index={index}
                        isFavorite={favorites.includes(demo.id)}
                        onToggleFavorite={() => toggleFavorite(demo.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDemos.map((demo, index) => (
                <DemoCard 
                  key={demo.id} 
                  demo={demo} 
                  index={index}
                  isFavorite={favorites.includes(demo.id)}
                  onToggleFavorite={() => toggleFavorite(demo.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1628] border-t border-cyan-500/20 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">© 2024 Software Vala - The Name of Trust. All rights reserved.</p>
          <p className="text-cyan-400 mt-2">20 Master Categories • 147 Software Solutions • 20 Live Demos Ready</p>
        </div>
      </footer>
    </div>
  );
};

// Demo Card Component - Enhanced with interactions
const DemoCard = ({ demo, index, isFavorite, onToggleFavorite }: { 
  demo: Demo; 
  index: number; 
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) => {
  const Icon = demo.icon;
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<'features' | 'tech'>('features');
  const [showQuickView, setShowQuickView] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <Card className={`bg-gradient-to-br from-[#1a2d4a] to-[#0d1e36] border-cyan-500/20 transition-all duration-500 overflow-hidden group h-full ${isHovered ? 'border-cyan-400/60 shadow-2xl shadow-cyan-500/20 scale-[1.02]' : ''}`}>
        <CardContent className="p-0 flex flex-col h-full">
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${demo.color} p-4 relative overflow-hidden`}>
            {/* Animated background pattern */}
            <div className={`absolute inset-0 opacity-20 transition-opacity duration-500 ${isHovered ? 'opacity-40' : ''}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl transform -translate-x-4 translate-y-4" />
            </div>
            
            <div className="flex justify-between items-start relative z-10">
              <motion.div 
                className="bg-white/20 p-3 rounded-xl backdrop-blur-sm"
                animate={{ rotate: isHovered ? [0, -5, 5, 0] : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Icon className="h-8 w-8 text-white" />
              </motion.div>
              <div className="flex gap-2 items-center">
                {demo.status === "COMING_SOON" && (
                  <Badge className="bg-yellow-500/90 text-black font-bold text-xs animate-pulse">
                    COMING SOON
                  </Badge>
                )}
                {demo.status === "ACTIVE" && (
                  <Badge className="bg-emerald-500/90 text-white font-bold text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    LIVE DEMO
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Quick action buttons on hover */}
            <motion.div 
              className="absolute bottom-2 right-2 flex gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                  toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites!');
                }}
                className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-all"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickView(!showQuickView);
                }}
                className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-all"
              >
                <Eye className="h-4 w-4 text-white" />
              </button>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-lg font-bold text-white leading-tight">{demo.name}</h3>
              {demo.status === "ACTIVE" && (
                <Badge className="bg-cyan-500/20 text-cyan-300 text-[10px] shrink-0 ml-2">
                  #{index + 1}
                </Badge>
              )}
            </div>
            <p className="text-cyan-400 text-xs mb-2 flex items-center gap-1">
              <Award className="h-3 w-3" /> {demo.category}
            </p>
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{demo.description}</p>

            {/* Interactive Tabs */}
            <div className="mb-3">
              <div className="flex gap-1 mb-2">
                <button
                  onClick={() => setActiveTab('features')}
                  className={`text-xs px-2 py-1 rounded transition-all ${activeTab === 'features' ? 'bg-cyan-500/30 text-cyan-300' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Features
                </button>
                <button
                  onClick={() => setActiveTab('tech')}
                  className={`text-xs px-2 py-1 rounded transition-all ${activeTab === 'tech' ? 'bg-purple-500/30 text-purple-300' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Tech Stack
                </button>
              </div>
              
              <motion.div 
                className="min-h-[52px]"
                initial={false}
                animate={{ opacity: 1 }}
                key={activeTab}
              >
                {activeTab === 'features' ? (
                  <div className="flex flex-wrap gap-1">
                    {demo.features.map((feature, i) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 cursor-default transition-colors">
                          {feature}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {[...demo.frontend, ...demo.backend].map((tech, i) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 cursor-default transition-colors">
                          {tech}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Price with animation */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-500 line-through text-sm">{demo.price}</span>
              <motion.span 
                className="text-emerald-400 font-bold text-xl"
                animate={{ scale: isHovered ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                {demo.discountPrice}
              </motion.span>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs animate-pulse">
                40% OFF
              </Badge>
            </div>

            {/* Enhanced Actions */}
            <div className="flex gap-2 mt-auto">
              {demo.status === "ACTIVE" ? (
                <>
                  <Link to={demo.url} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all">
                      <Play className="h-4 w-4 mr-2" /> Live Demo
                    </Button>
                  </Link>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
                    onClick={() => toast.success("🎉 Redirecting to purchase...", { description: `${demo.name} - ${demo.discountPrice}` })}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" /> Buy Now
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    className="flex-1 bg-gray-600/50 cursor-not-allowed text-gray-400 border border-gray-500/30"
                    disabled
                  >
                    <Clock className="h-4 w-4 mr-2" /> Coming Soon
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all"
                    onClick={() => toast.info("📧 We'll notify you when this is available!", { description: demo.name })}
                  >
                    <Bell className="h-4 w-4 mr-2" /> Notify Me
                  </Button>
                </>
              )}
            </div>
            
            {/* Quick Stats on hover */}
            <motion.div 
              className="mt-3 pt-3 border-t border-cyan-500/10 grid grid-cols-3 gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? 'auto' : 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center">
                <p className="text-cyan-400 text-lg font-bold">{Math.floor(Math.random() * 50 + 50)}+</p>
                <p className="text-gray-500 text-[10px]">Clients</p>
              </div>
              <div className="text-center">
                <p className="text-emerald-400 text-lg font-bold">4.{Math.floor(Math.random() * 3 + 7)}</p>
                <p className="text-gray-500 text-[10px]">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-purple-400 text-lg font-bold">{Math.floor(Math.random() * 10 + 5)}h</p>
                <p className="text-gray-500 text-[10px]">Delivery</p>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Index;
