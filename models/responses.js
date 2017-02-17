const RESPONSES = {
  CREATED : {
    statusCode : 201,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'Sent successfully',
      err: false,
    })
  },
  ERROR : {
    statusCode : 400,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'ERROR',
      err: true,
    })
  },
  SPAM: {
    statusCode : 400,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'Possible spam',
      err: true,
    })
  },
  EMAIL: {
    SPAM: {
      statusCode : 400,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify({
        message: 'Invalid Email',
        err: true,
      })
    },
  }
};

module.exports = RESPONSES;