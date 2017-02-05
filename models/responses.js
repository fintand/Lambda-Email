const RESPONSES = {
  OK : {
    statusCode : 200,
    body: JSON.stringify({
      message: 'Sent successfully',
      err: false,
    })
  },
  ERROR : {
    statusCode : 400,
    body: JSON.stringify({
      message: 'ERROR',
      err: true,
    })
  },
  SPAM: {
    statusCode : 400,
    body: JSON.stringify({
      message: 'Possible spam',
      err: true,
    })
  },
  EMAIL: {
    SPAM: {
      statusCode : 400,
      body: JSON.stringify({
        message: 'Invalid Email',
        err: true,
      })
    },
  }
};

module.exports = RESPONSES;