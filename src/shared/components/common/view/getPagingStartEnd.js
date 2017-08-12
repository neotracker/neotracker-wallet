/* @flow */
export default ({
  page,
  pageSize,
  isLoadingMore,
}: {
  page: number,
  pageSize: number,
  isLoadingMore: boolean,
}) => {
  let start = (page - 1) * pageSize;
  let end = page * pageSize;
  let pageOut = page;
  if (isLoadingMore) {
    start -= pageSize;
    end -= pageSize;
    pageOut = page - 1;
  }

  return { start, end, pageOut };
};
