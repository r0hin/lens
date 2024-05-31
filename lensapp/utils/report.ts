export const generateReport = (
  date: Date,
  publicKey: `0x{string}`,
  scoreDelta: string,
  isPayed: boolean,
  ratio: string,
  remark: string,
): string => {
  // Helper function to format the date as YYYYMMDD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  };

  // Extract the last 8 characters from the public key
  const vendorKey = publicKey.slice(-8);

  // Ensure scoreDelta has a leading sign and pad to 3 digits and 1 sign
  const formattedScoreDelta =
    scoreDelta.startsWith('+') || scoreDelta.startsWith('-')
      ? scoreDelta.padStart(4, '0')
      : `+${scoreDelta.padStart(3, '0')}`;

  // Convert isPayed to 1 or 0
  const payed = isPayed ? '1' : '0';

  // Assume the ratio input is correct and use it as is
  // pad to	3 characters
  const creditUtilRatio = ratio.padStart(3, '0');

  // Construct the final report string

  const report = `${formatDate(
    date,
  )}${vendorKey}${formattedScoreDelta}${payed}${creditUtilRatio}${remark}`;
  return report;
};

export const parseReport = (report: string) => {
  // Extract parts of the report
  const dateStr = report.slice(0, 8);
  const vendorKey = report.slice(8, 16);
  const scoreDelta = parseInt(report.slice(16, 20), 10); // Convert to integer
  const payed = report.slice(20, 21); // This is not used in the component
  const creditUtilRatio = report.slice(21, 24); // This is not used in the component
  const remark = report.slice(24); // Assuming the rest is the remark

  // Convert the date string to a human-readable format
  const date = new Date(
    `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`,
  );

  // Helper function to convert the date to a "time ago" format
  const daysAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.abs(now - date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    return `${days} days ago`;
  };

  const timeAgoStr = daysAgo(date);

  return {vendorKey, scoreDelta, date, timeAgoStr, remark};
};
