exports._200 = (body) => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
};

exports._400 = (body) => {
  return {
    statusCode: 400,
    body: JSON.stringify(body),
  };
};
