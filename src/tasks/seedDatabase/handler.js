/**
 * This file was generated using 8base CLI.
 * 
 * To learn more about writing custom task functions, visit
 * the 8base documentation at:
 * 
 * https://docs.8base.com/docs/8base-console/custom-functions/tasks/
 *
 * To update this functions invocation settings, update its configuration block
 * in the projects 8base.yml file:
 *  functions:
 *    seedDatabase:
 *      ...
 * 
 * Data that is sent to the function can be accessed on the event argument at:
 *  event.data[KEY_NAME]
 *
 * There are two ways to invoke this function locally:
 *  
 *  (1) Explicit file mock file path using '-p' flag:
 *    8base invoke-local seedDatabase -p src/resolvers/seedDatabase/mocks/request.json
 *
 *  (2) Default mock file location using -m flag:
 *    8base invoke-local seedDatabase -m request
 *
 *  Add new mocks to this function to test different input arguments. Mocks can easily be generated
 *  the following generator command:
 *    8base generate mock seedDatabase -m [MOCK_FILE_NAME]
 */

const CREATE_TENANT_MUTATION = `
  mutation($tenant: TenantCreateInput!) {
    tenantCreate(data: $tenant) {
      lots {
        items {
          id
        }
      }
    }
  }
`

const CREATE_SPACES_MUTATION = `
  mutation($spaces: [ParkingSpaceCreateManyInput]!) {
    parkingSpaceCreateMany(data: $spaces) {
      count
    }
  }
`

module.exports = async (event, ctx) => {
  const {
    tenant,
    parkingSpaces
  } = event.data;

  const { tenantCreate } = await ctx.api.gqlRequest(CREATE_TENANT_MUTATION, { tenant })

  tenantCreate.lots.items.forEach(async ({ id }) => {
    let spaces = parkingSpaces.map(space => {
      space.lot = { 
        connect: { id }
      }
      return space
    })
    await ctx.api.gqlRequest(CREATE_SPACES_MUTATION, { spaces })
  }); 

  return {
    data: {
      result: `Task complete.`
    },
  };
};
