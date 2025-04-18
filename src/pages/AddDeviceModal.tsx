/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { DeviceType, DeviceFormData, IoTDevice } from '@/types';

interface AddDeviceModalProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  devices: IoTDevice[];
  setDevices: (devices: IoTDevice[]) => void;
  layouts: any[];
  setLayouts: (layouts: any[]) => void;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  dialogOpen,
  setDialogOpen,
  devices,
  setDevices,
  layouts,
  setLayouts,
}) => {
  const [newDevice, setNewDevice] = useState<DeviceFormData>({
    name: '',
    type: 'switch',
    icon: 'Power',
    color: 'hsl(var(--primary))'
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setNewDevice({
      name: '',
      type: 'switch',
      icon: 'Power',
      color: 'hsl(var(--primary))'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDevice(prev => ({
      ...prev,
      [name]: name === 'min' || name === 'max' || name === 'value' 
        ? Number(value) 
        : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewDevice(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveDevice = () => {
    try {
      if (!newDevice.name) {
        toast.error('Please enter a device name');
        return;
      }

      let width = 1;
      let height = 1;
      
      if (newDevice.type === 'joystick') {
        width = 2;
        height = 2;
      } else if (newDevice.type === 'slider') {
        width = 2;
        height = 1;
      }

      const newId = `device-${Date.now()}`;
      const createdDevice: IoTDevice = {
        id: newId,
        name: newDevice.name,
        type: newDevice.type,
        icon: newDevice.icon,
        color: newDevice.color,
        organizationId: '1',
        x: 0,
        y: devices.length > 0 ? Math.max(...devices.map(d => d.y)) + 1 : 0,
        w: width,
        h: height,
      };

      switch (newDevice.type) {
        case 'switch':
        case 'button':
          createdDevice.status = false;
          break;
        case 'slider':
          createdDevice.status = true;
          createdDevice.value = newDevice.value || 0;
          createdDevice.min = newDevice.min || 0;
          createdDevice.max = newDevice.max || 100;
          break;
        case 'input':
          createdDevice.value = newDevice.value || 0;
          break;
        case 'timer':
          createdDevice.timerValue = 60;
          break;
        case 'joystick':
          createdDevice.joystickPosition = { x: 0, y: 0 };
          break;
      }

      const newLayoutItem = {
        i: newId,
        x: createdDevice.x,
        y: createdDevice.y,
        w: width,
        h: height,
        minW: 1,
        minH: 1
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
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Control</DialogTitle>
          <DialogDescription>
            Add a new control element to your machinery dashboard.
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
              placeholder="Speed Control"
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
              onValueChange={(value) => handleSelectChange('type', value as DeviceType)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select control type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="switch">Switch (On/Off)</SelectItem>
                <SelectItem value="slider">Slider (Range)</SelectItem>
                <SelectItem value="button">Button</SelectItem>
                <SelectItem value="input">Input Field</SelectItem>
                <SelectItem value="stepH">Step Horizontal</SelectItem>
                <SelectItem value="stepV">Step Vertical</SelectItem>
                <SelectItem value="joystick">Joystick</SelectItem>
                <SelectItem value="timer">Timer</SelectItem>
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
          <Button 
            variant="outline" 
            onClick={closeDialog}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveDevice}
          >
            Add Control
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceModal;
