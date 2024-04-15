/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRRPPEvent = /* GraphQL */ `
  query GetRRPPEvent($id: ID!) {
    getRRPPEvent(id: $id) {
      id
      Event {
        id
        nameEvent
        locationEvent
        descriptionEvent
        flyerMiniEvent
        startDateE
        upDateE
        downDateE
        nameLocationEvent
        userID
        __typename
      }
      rrppID
      Tickets {
        nextToken
        __typename
      }
      rRPPEventEventId
      __typename
    }
  }
`;
export const listRRPPEvents = /* GraphQL */ `
  query ListRRPPEvents(
    $filter: ModelRRPPEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRRPPEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        rrppID
        rRPPEventEventId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const rRPPEventsByRrppID = /* GraphQL */ `
  query RRPPEventsByRrppID(
    $rrppID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelRRPPEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    rRPPEventsByRrppID(
      rrppID: $rrppID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        rrppID
        rRPPEventEventId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getRRPP = /* GraphQL */ `
  query GetRRPP($id: ID!) {
    getRRPP(id: $id) {
      id
      nameRRPP
      surnameRRPP
      dniRRPP
      emailRRPP
      RRPPEvents {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const listRRPPS = /* GraphQL */ `
  query ListRRPPS(
    $filter: ModelRRPPFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRRPPS(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        nameRRPP
        surnameRRPP
        dniRRPP
        emailRRPP
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPayment = /* GraphQL */ `
  query GetPayment($id: ID!) {
    getPayment(id: $id) {
      id
      cart
      paymentStatus
      emailBuyer
      dniBuyer
      amount
      eventName
      createdDate
      updatedDate
      eventID
      __typename
    }
  }
`;
export const listPayments = /* GraphQL */ `
  query ListPayments(
    $filter: ModelPaymentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPayments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        cart
        paymentStatus
        emailBuyer
        dniBuyer
        amount
        eventName
        createdDate
        updatedDate
        eventID
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const paymentsByEventID = /* GraphQL */ `
  query PaymentsByEventID(
    $eventID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPaymentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    paymentsByEventID(
      eventID: $eventID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cart
        paymentStatus
        emailBuyer
        dniBuyer
        amount
        eventName
        createdDate
        updatedDate
        eventID
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getTicket = /* GraphQL */ `
  query GetTicket($id: ID!) {
    getTicket(id: $id) {
      id
      qrTicket
      validTicket
      dniTicket
      emailTicket
      eventID
      typeticketID
      rrppeventID
      __typename
    }
  }
`;
export const listTickets = /* GraphQL */ `
  query ListTickets(
    $filter: ModelTicketFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTickets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        qrTicket
        validTicket
        dniTicket
        emailTicket
        eventID
        typeticketID
        rrppeventID
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const ticketsByTypeticketID = /* GraphQL */ `
  query TicketsByTypeticketID(
    $typeticketID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelTicketFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ticketsByTypeticketID(
      typeticketID: $typeticketID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        qrTicket
        validTicket
        dniTicket
        emailTicket
        eventID
        typeticketID
        rrppeventID
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const ticketsByRrppeventID = /* GraphQL */ `
  query TicketsByRrppeventID(
    $rrppeventID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelTicketFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ticketsByRrppeventID(
      rrppeventID: $rrppeventID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        qrTicket
        validTicket
        dniTicket
        emailTicket
        eventID
        typeticketID
        rrppeventID
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getTypeTicket = /* GraphQL */ `
  query GetTypeTicket($id: ID!) {
    getTypeTicket(id: $id) {
      id
      nameTT
      priceTT
      quantityTT
      descriptionTT
      activeTT
      startDateTT
      endDateTT
      upDateTT
      downDateTT
      eventID
      Tickets {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const listTypeTickets = /* GraphQL */ `
  query ListTypeTickets(
    $filter: ModelTypeTicketFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTypeTickets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        nameTT
        priceTT
        quantityTT
        descriptionTT
        activeTT
        startDateTT
        endDateTT
        upDateTT
        downDateTT
        eventID
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const typeTicketsByEventID = /* GraphQL */ `
  query TypeTicketsByEventID(
    $eventID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelTypeTicketFilterInput
    $limit: Int
    $nextToken: String
  ) {
    typeTicketsByEventID(
      eventID: $eventID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        nameTT
        priceTT
        quantityTT
        descriptionTT
        activeTT
        startDateTT
        endDateTT
        upDateTT
        downDateTT
        eventID
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getEvent = /* GraphQL */ `
  query GetEvent($id: ID!) {
    getEvent(id: $id) {
      id
      nameEvent
      locationEvent
      descriptionEvent
      flyerMiniEvent
      startDateE
      upDateE
      downDateE
      nameLocationEvent
      TypeTickets {
        nextToken
        __typename
      }
      Payments {
        nextToken
        __typename
      }
      userID
      __typename
    }
  }
`;
export const listEvents = /* GraphQL */ `
  query ListEvents(
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        nameEvent
        locationEvent
        descriptionEvent
        flyerMiniEvent
        startDateE
        upDateE
        downDateE
        nameLocationEvent
        userID
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const eventsByUserID = /* GraphQL */ `
  query EventsByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    eventsByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        nameEvent
        locationEvent
        descriptionEvent
        flyerMiniEvent
        startDateE
        upDateE
        downDateE
        nameLocationEvent
        userID
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      nameUser
      surnameUser
      dniUser
      emailUser
      Events {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        nameUser
        surnameUser
        dniUser
        emailUser
        __typename
      }
      nextToken
      __typename
    }
  }
`;
