const calculateDateDifferenceInMinutes = (startDate: Date, endDate: Date) => {
  const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
  const differenceInMinutes = differenceInMilliseconds / 1000 / 60;

  return differenceInMinutes;
};

export { calculateDateDifferenceInMinutes };
