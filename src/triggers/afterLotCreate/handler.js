/**
 * This file was generated using 8base CLI.
 * 
 * To learn more about writing custom trigger functions, visit
 * the 8base documentation at:
 * 
 * https://docs.8base.com/docs/8base-console/custom-functions/triggers/
 *
 * To update this functions invocation settings, update its configuration block
 * in the projects 8base.yml file:
 *  functions:
 *    afterLotCreate:
 *      ...
 * 
 * Data that is sent to the function can be accessed on the event argument at:
 *  event.data[KEY_NAME]
 *
 * There are two ways to invoke this function locally:
 *  
 *  (1) Explicit file mock file path using '-p' flag:
 *    8base invoke-local afterLotCreate -p src/resolvers/afterLotCreate/mocks/request.json
 *
 *  (2) Default mock file location using -m flag:
 *    8base invoke-local afterLotCreate -m request
 *
 *  Add new mocks to this function to test different input arguments. Mocks can easily be generated
 *  the following generator command:
 *    8base generate mock afterLotCreate -m [MOCK_FILE_NAME]
 */

/**
 * Signed up for https://positionstack.com/ free Plan
 * 
 * http://api.positionstack.com/v1/forward?access_key=YOUR_ACCESS_KEY&query=1600%20Pennsylvania%20Ave%20NW%20Washington%20DC
 */

/* Set Local ENV Vars */
require('../../envs')

const axios = require('axios');

const MUTATION = `
  mutation(
    $id: ID!
    $coordinates: GeoJSONCoordinates
    $geoCodingMeta: JSON
  ) {
    lotUpdate(data: {
      id: $id
      coordinates: $coordinates
      geoCodingMeta: $geoCodingMeta
    }) {
      id
    }
  }
`

module.exports = async (event, ctx) => {
  let {
    id,
    address: {
      country,
      street1,
      state,
      city,
      zip
    }
   } = event.data;

  let encodedAddress = encodeURIComponent(
    `${street1}, ${city}, ${state} ${zip}, ${country}`
  )

  try {
    let { 
      data: {
        data: [geoCodingMeta]
      } 
    } = await axios.get(
      `http://api.positionstack.com/v1/forward?access_key=${process.env.API_KEY}&query=${encodedAddress}`
    );

    /* Update record with geocoding */
    await ctx.api.gqlRequest(MUTATION,
      {
        id,
        geoCodingMeta,
        coordinates: [geoCodingMeta.latitude, geoCodingMeta.longitude]
      },
      {
        checkPermissions: false
      }
    )
  } catch (error) {
    console.log(error)
    return {
      errors: [{
        message: 'Error during geocoding',
        code: 'geocoding_error'
      }],
    };
  }

  return {
    data: event.data,
  };
};
