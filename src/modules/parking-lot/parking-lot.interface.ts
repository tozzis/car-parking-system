export interface CarSizeStatus {
  small?: number;
  medium?: number;
  large?: number;
}

export interface ParkingLotStatusResponse {
  totalSlots: number;
  occupiedSlots: number;
  availableSlots: number;
  availableCarSizes: CarSizeStatus;
}