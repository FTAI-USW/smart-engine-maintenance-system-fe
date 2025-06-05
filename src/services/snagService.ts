export async function fetchSnags(page = 1, pageSize = 10) {
  const response = await fetch(`http://172.18.16.15:3000/snags?page=${page}&pageSize=${pageSize}`);
  if (!response.ok) {
    throw new Error("Failed to fetch snags");
  }
  return await response.json();
} 