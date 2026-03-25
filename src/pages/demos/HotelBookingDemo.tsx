import React, { useState } from 'react';
import { 
  Building2, Calendar, Users, CreditCard, 
  BedDouble, Wifi, Car, Coffee, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import softwareValaLogo from '@/assets/software-vala-logo.jpg';

// Sample rooms
const rooms = [
  { id: 101, type: 'Deluxe Room', price: 4500, status: 'occupied', guest: 'Mr. Sharma' },
  { id: 102, type: 'Deluxe Room', price: 4500, status: 'available', guest: null },
  { id: 103, type: 'Suite', price: 8500, status: 'reserved', guest: 'Ms. Patel' },
  { id: 201, type: 'Premium Suite', price: 12000, status: 'occupied', guest: 'Mr. Khan' },
  { id: 202, type: 'Deluxe Room', price: 4500, status: 'available', guest: null },
  { id: 203, type: 'Suite', price: 8500, status: 'maintenance', guest: null },
];

const bookings = [
  { id: 'BK001', guest: 'Mr. Sharma', room: 101, checkIn: '2025-01-01', checkOut: '2025-01-03', amount: 9000, status: 'checked-in' },
  { id: 'BK002', guest: 'Ms. Patel', room: 103, checkIn: '2025-01-02', checkOut: '2025-01-05', amount: 25500, status: 'confirmed' },
  { id: 'BK003', guest: 'Mr. Khan', room: 201, checkIn: '2024-12-30', checkOut: '2025-01-02', amount: 36000, status: 'checked-in' },
];

const HotelBookingDemo = () => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const stats = [
    { label: 'Available Rooms', value: '12', icon: BedDouble, color: 'text-green-500' },
    { label: 'Occupied', value: '24', icon: Users, color: 'text-blue-500' },
    { label: 'Today Check-ins', value: '8', icon: Calendar, color: 'text-purple-500' },
    { label: 'Today Revenue', value: '₹1.2L', icon: CreditCard, color: 'text-orange-500' },
  ];

  const amenities = [
    { icon: Wifi, name: 'Free WiFi' },
    { icon: Car, name: 'Parking' },
    { icon: Coffee, name: 'Breakfast' },
    { icon: BedDouble, name: 'AC Room' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/10 border-green-500/30 text-green-600';
      case 'occupied': return 'bg-blue-500/10 border-blue-500/30 text-blue-600';
      case 'reserved': return 'bg-purple-500/10 border-purple-500/30 text-purple-600';
      case 'maintenance': return 'bg-red-500/10 border-red-500/30 text-red-600';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={softwareValaLogo} alt="Software Vala" className="w-10 h-10 rounded-full" />
            <div>
              <h1 className="font-bold text-lg">Hotel Management</h1>
              <p className="text-xs text-muted-foreground">Powered by Software Vala</p>
            </div>
          </div>
          <Button size="sm" className="gap-1">
            <Calendar className="w-4 h-4" />
            New Booking
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="rooms" className="gap-1">
              <BedDouble className="w-4 h-4" /> Rooms
            </TabsTrigger>
            <TabsTrigger value="bookings" className="gap-1">
              <Calendar className="w-4 h-4" /> Bookings
            </TabsTrigger>
            <TabsTrigger value="guests" className="gap-1">
              <Users className="w-4 h-4" /> Guests
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-1">
              <CreditCard className="w-4 h-4" /> Billing
            </TabsTrigger>
          </TabsList>

          {/* Rooms */}
          <TabsContent value="rooms">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {rooms.map(room => (
                <Card 
                  key={room.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${getStatusColor(room.status)}`}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold mb-1">{room.id}</div>
                    <div className="text-xs mb-2">{room.type}</div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {room.status}
                    </Badge>
                    {room.guest && (
                      <p className="text-xs mt-2 text-muted-foreground truncate">{room.guest}</p>
                    )}
                    <p className="text-sm font-medium mt-2">₹{room.price.toLocaleString()}/night</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Book */}
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Quick Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <Label>Check-in</Label>
                    <Input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
                  </div>
                  <div>
                    <Label>Check-out</Label>
                    <Input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
                  </div>
                  <div>
                    <Label>Room Type</Label>
                    <Input placeholder="Select room type" />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">Search Rooms</Button>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  {amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                      <amenity.icon className="w-3 h-3" />
                      {amenity.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookings.map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{booking.guest}</p>
                          <p className="text-xs text-muted-foreground">
                            Room {booking.room} • {booking.checkIn} to {booking.checkOut}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{booking.amount.toLocaleString()}</p>
                        <Badge variant={booking.status === 'checked-in' ? 'default' : 'secondary'} className="text-xs">
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guests */}
          <TabsContent value="guests">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Current Guests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookings.filter(b => b.status === 'checked-in').map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{booking.guest}</p>
                          <p className="text-xs text-muted-foreground">
                            Room {booking.room}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Checkout</p>
                        <p className="text-sm font-medium">{booking.checkOut}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pending Bills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookings.map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{booking.guest}</p>
                        <p className="text-xs text-muted-foreground">Room {booking.room} • {booking.id}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">₹{booking.amount.toLocaleString()}</span>
                        <Button size="sm">Generate Bill</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t py-4 mt-8">
        <p className="text-center text-xs text-muted-foreground">
          Powered by <span className="font-medium">Software Vala</span> • The Name of Trust
        </p>
      </footer>
    </div>
  );
};

export default HotelBookingDemo;
