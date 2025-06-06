import { asyncApiHandler } from '../utils/asyncApiHandler';

export interface WorkOrder {
  workOrderId: string;
  workOrder: string;
  esnId: string;
  offEngineSerial: string;
  forEngineSerial: string;
  workCenterId: string;
  laborId: string;
  taskModule: string;
  sequence: number;
  taskStatus: string;
  estimatedHours: number;
  entryDate: string;
  tollGate: string;
  createdDate: string;
  updatedDate: string;
  userId: string;
  hoursWorked: number;
  clockIn: string;
  clockOff: string;
  EMPLOYEE_NAME?: string;
  TASK_DESC?: string;
  TOLL_GATE?: string;
  WORK_CENTER?: string;
  HOURS_WORKED?: number;
  SEQUENCE?: number;
  OFF_ESN?: string;
  FOR_ESN?: string;
}

export interface WorkOrderResponse {
  data: WorkOrder[];
  pagination: {
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface WorkOrderFilters {
  [key: string]: string | number | boolean | undefined;
  workOrder?: string;
  esnId?: string;
  taskStatus?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchWorkOrders(
  filters: WorkOrderFilters = {}
): Promise<WorkOrderResponse> {
  const { page = 1, pageSize = 10, ...otherFilters } = filters;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...otherFilters,
  });

  return asyncApiHandler<WorkOrderResponse>(`/work-order-details?${queryParams}`);
}

export async function fetchWorkOrderById(
  workOrderId: string
): Promise<WorkOrder | null> {
  return asyncApiHandler<WorkOrder | null>(`/work-order-details/${workOrderId}`);
}

export async function fetchWorkOrdersByEngine(
  esnId: string,
  includeCompleted: boolean = false
): Promise<WorkOrder[]> {
  const queryParams = new URLSearchParams({
    esnId,
    includeCompleted: includeCompleted.toString(),
  });

  return asyncApiHandler<WorkOrder[]>(`/work-order-details?${queryParams}`);
}
