const AWS = require("aws-sdk");
const {createSuccessResponse, createErrorResponse} = require("./response-utils");

exports.handler = async (event) => {
  console.log(event);
  const {
    first_name, url, featureList, email, productName,
    emailTemplateName, welcomeMessage
  } = event;
  console.log(`Email sent to ${email} with ${emailTemplateName}`);
  const params = {
    Destination: { /* required */
      ToAddresses: [
        email
        /* more To email addresses */
      ]
    },
    Source: 'notifications@cloudorka.com', /* required */
    Template: emailTemplateName, /* required */
    TemplateData: `{\"productName\": \"${productName}\",\"first_name\": \"${first_name}\", \"url\": \"${url}\", \"featureList\": \"${featureList}\",  \"email\": \"${email}\", \"welcomeMessage\": \"${welcomeMessage}"}`, /* required */
  };
  console.log(params);
  // Create the promise and SES service object
  const SES = await new AWS.SES();
  try {
    const sesResult = await SES.sendTemplatedEmail(params).promise();
    console.log("SES invoked successfully", sesResult);
    return createSuccessResponse(sesResult);
  } catch (error) {
    console.log(error);
    return createErrorResponse(error);
  }
};
