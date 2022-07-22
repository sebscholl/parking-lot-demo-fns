## Create New Lot Query

```gql
mutation(
  $name: String!
  $address: SmartAddressInput!
  $coordinates: GeoJSONCoordinates
  $geoCodingMeta: JSON
) {
  lotCreate(data: {
    name: $name
    address: $address
    coordinates: $coordinates
    geoCodingMeta: $geoCodingMeta
  }) {
    id
  }
}
```

## Distance Filter Query

```gql
query {
  lotsList(filter: {
    coordinates: {
      distance: {
        from: {
          type: Point
          coordinates: [25.787777,-80.142025]
        },
        value: {
          lt: 100
        }
        unit: meters
      }
    }
  }) {
    count
    items {
      id
      name
      address {
        country
        street1
        state
        city
        zip
      }
    }
  }
}
```