
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { 
  LightbulbIcon, 
  Fan, 
  Thermometer, 
  Plug, 
  Power, 
  Plus,
  X
} from 'lucide-react';
import { TouchBackend } from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';
import { IoTDevice } from '@/types';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { devicesApi } from '@/services/api';

// Mock device data (would typically come from API)
const initialDevices: IoTDevice[] = [
  {
    id: '1',
    name: 'Living Room Light',
    type: 'switch',
    status: false,
    x: 0,
    y: 0,
    icon: 'LightbulbIcon',
    organizationId: '1',
  },
  {
    id: '2',
    name: 'Kitchen Fan',
    type: 'switch',
    status: true,
    x: 1,
    y: 0,
    icon: 'Fan',
    organizationId: '1',
  },
  {
    id: '3',
    name: 'Bedroom Thermostat',
    type: 'slider',
    status: true,
    value: 72,
    min: 60,
    max: 85,
    x: 0,
    y: 1,
    icon: 'Thermometer',
    organizationId: '1',
  },
  {
    id: '4',
    name: 'TV Socket',
    type: 'switch',
    status: true,
    x: 1,
    y: 1,
    icon: 'Plug',
    organizationId: '1',
  },
];

// Helper function to get the appropriate icon component
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'LightbulbIcon':
      return <LightbulbIcon className="h-5 w-5" />;
    case 'Fan':
      return <Fan className="h-5 w-5" />;
    case 'Thermometer':
      return <Thermometer className="h-5 w-5" />;
    case 'Plug':
      return <Plug className="h-5 w-5" />;
    default:
      return <Power className="h-5 w-5" />;
  }
};

// Device Card Component
const DeviceCard: React.FC<{
  device: IoTDevice;
  onToggle: (id: string, status: boolean) => void;
  onValueChange?: (id: string, value: number) => void;
}> = ({ device, onToggle, onValueChange }) => {
  const handleToggle = () => {
    onToggle(device.id, !device.status);
  };
  
  const handleSliderChange = (value: number[]) => {
    if (onValueChange) {
      onValueChange(device.id, value[0]);
    }
  };

  return (
    <Card className={`iot-card ${device.status ? 'iot-card-active' : ''} h-full`}>
      <CardHeader className="iot-card-header pb-2">
        <div className="flex items-center space-x-2">
          {getIconComponent(device.icon || '')}
          <CardTitle className="iot-card-title">{device.name}</CardTitle>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Switch 
            checked={device.status} 
            onCheckedChange={handleToggle}
            className="iot-switch"
          />
        </div>
      </CardHeader>
      <CardContent className="iot-card-content">
        <div className="text-sm text-muted-foreground">
          Status: {device.status ? 'On' : 'Off'}
          
          {device.type === 'slider' && device.status && device.value !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>{device.min}°</span>
                <span className="font-medium">{device.value}°</span>
                <span>{device.max}°</span>
              </div>
              <Slider
                value={[device.value]}
                min={device.min}
                max={device.max}
                step={1}
                onValueChange={handleSliderChange}
                className="w-full"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Device form interface
interface DeviceFormData {
  name: string;
  type: 'switch' | 'slider';
  icon: string;
  min?: number;
  max?: number;
  value?: number;
}

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [devices, setDevices] = useState<IoTDevice[]>(initialDevices);
  const [layouts, setLayouts] = useState<any>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDevice, setNewDevice] = useState<DeviceFormData>({
    name: '',
    type: 'switch',
    icon: 'Power',
  });
  const isMobile = useIsMobile();
  
  // Initialize layout from devices
  useEffect(() => {
    const initialLayout = devices.map((device) => ({
      i: device.id,
      x: device.x,
      y: device.y,
      w: 1,
      h: 1,
    }));
    setLayouts(initialLayout);
  }, []);

  const handleToggleDevice = (id: string, status: boolean) => {
    try {
      // Update local state immediately for responsive UI
      const updatedDevices = devices.map(device => 
        device.id === id ? { ...device, status } : device
      );
      setDevices(updatedDevices);
      
      // Optionally call API if available
      // devicesApi.updateStatus(id, status);
      toast.success(`Device ${status ? 'turned on' : 'turned off'}`);
    } catch (error) {
      toast.error('Failed to toggle device');
      console.error('Toggle error:', error);
    }
  };

  const handleValueChange = (id: string, value: number) => {
    const updatedDevices = devices.map(device => 
      device.id === id ? { ...device, value } : device
    );
    setDevices(updatedDevices);
  };

  const handleLayoutChange = (newLayout: any) => {
    setLayouts(newLayout);
    // Update device positions based on layout
    const updatedDevices = devices.map(device => {
      const layoutItem = newLayout.find((item: any) => item.i === device.id);
      if (layoutItem) {
        return {
          ...device,
          x: layoutItem.x,
          y: layoutItem.y,
        };
      }
      return device;
    });
    setDevices(updatedDevices);
  };

  const handleAddDevice = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setNewDevice({
      name: '',
      type: 'switch',
      icon: 'Power',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDevice({
      ...newDevice,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewDevice({
      ...newDevice,
      [name]: value,
    });
  };

  const handleSaveDevice = () => {
    try {
      if (!newDevice.name) {
        toast.error('Please enter a device name');
        return;
      }

      // Create new device with default values
      const newId = `device-${Date.now()}`;
      const createdDevice: IoTDevice = {
        id: newId,
        name: newDevice.name,
        type: newDevice.type,
        status: false,
        icon: newDevice.icon,
        organizationId: '1',
        x: 0,
        y: devices.length > 0 ? Math.max(...devices.map(d => d.y)) + 1 : 0,
      };

      // Add min, max and value for slider types
      if (newDevice.type === 'slider') {
        createdDevice.min = newDevice.min || 0;
        createdDevice.max = newDevice.max || 100;
        createdDevice.value = newDevice.value || 50;
      }

      // Update layout
      const newLayoutItem = {
        i: newId,
        x: createdDevice.x,
        y: createdDevice.y,
        w: 1,
        h: 1,
      };

      setDevices([...devices, createdDevice]);
      setLayouts([...layouts, newLayoutItem]);
      
      toast.success('Device added successfully');
      closeDialog();
      
    } catch (error) {
      toast.error('Failed to add device');
      console.error('Error adding device:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">IoT Control Dashboard</h1>
        <Button onClick={handleAddDevice}>
          <Plus className="mr-2 h-4 w-4" />
          Add Device
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <DndProvider backend={TouchBackend}>
          <div className="bg-muted/30 p-4 rounded-lg min-h-[500px]">
            {layouts.length > 0 && (
              <GridLayout
                className="layout"
                layout={layouts}
                cols={isMobile ? 1 : 2}
                rowHeight={isMobile ? 180 : 200}
                width={isMobile ? window.innerWidth - 40 : Math.min(window.innerWidth - 48, 800)}
                isResizable={false}
                isDraggable={true}
                onLayoutChange={handleLayoutChange}
                margin={[16, 16]}
                compactType="vertical"
              >
                {devices.map(device => (
                  <div key={device.id}>
                    <DeviceCard
                      device={device}
                      onToggle={handleToggleDevice}
                      onValueChange={handleValueChange}
                    />
                  </div>
                ))}
              </GridLayout>
            )}
          </div>
        </DndProvider>
      </div>

      {/* Add Device Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New IoT Device</DialogTitle>
            <DialogDescription>
              Create a new device to add to your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Living Room Light"
                className="col-span-3"
                value={newDevice.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select 
                value={newDevice.type} 
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="switch">Switch (On/Off)</SelectItem>
                  <SelectItem value="slider">Slider (Range)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                Icon
              </Label>
              <Select 
                value={newDevice.icon} 
                onValueChange={(value) => handleSelectChange('icon', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LightbulbIcon">Light Bulb</SelectItem>
                  <SelectItem value="Fan">Fan</SelectItem>
                  <SelectItem value="Thermometer">Thermostat</SelectItem>
                  <SelectItem value="Plug">Socket</SelectItem>
                  <SelectItem value="Power">Generic Device</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newDevice.type === 'slider' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="min" className="text-right">
                    Min Value
                  </Label>
                  <Input
                    id="min"
                    name="min"
                    type="number"
                    placeholder="0"
                    className="col-span-3"
                    value={newDevice.min || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="max" className="text-right">
                    Max Value
                  </Label>
                  <Input
                    id="max"
                    name="max"
                    type="number"
                    placeholder="100"
                    className="col-span-3"
                    value={newDevice.max || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Default Value
                  </Label>
                  <Input
                    id="value"
                    name="value"
                    type="number"
                    placeholder="50"
                    className="col-span-3"
                    value={newDevice.value || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveDevice}>Add Device</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
