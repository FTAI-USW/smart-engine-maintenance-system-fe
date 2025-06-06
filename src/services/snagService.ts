import { asyncApiHandler } from '../utils/asyncApiHandler';

export async function fetchSnags(page = 1, pageSize = 10) {
  return asyncApiHandler(`/snags?page=${page}&pageSize=${pageSize}`);
} 