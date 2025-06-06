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

const API_BASE_URL = "http://172.18.16.15:3000";

export async function fetchWorkOrders(
  filters: WorkOrderFilters = {}
): Promise<WorkOrderResponse> {
  const { page = 1, pageSize = 10, ...otherFilters } = filters;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...otherFilters,
  });

  const response = await fetch(
    `${API_BASE_URL}/work-order-details?${queryParams}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch work orders");
  }
  return await response.json();
}

export async function fetchWorkOrderById(
  workOrderId: string
): Promise<WorkOrder | null> {
  const response = await fetch(
    `${API_BASE_URL}/work-order-details/${workOrderId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch work order");
  }
  return await response.json();
}

export async function fetchWorkOrdersByEngine(
  esnId: string,
  includeCompleted: boolean = false
): Promise<WorkOrder[]> {
  const queryParams = new URLSearchParams({
    esnId,
    includeCompleted: includeCompleted.toString(),
  });

  const response = await fetch(
    `${API_BASE_URL}/work-order-details?${queryParams}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch work orders by engine");
  }
  return await response.json();
}
