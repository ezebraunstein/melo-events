/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateRRPPEvent = /* GraphQL */ `
  subscription OnCreateRRPPEvent(
    $filter: ModelSubscriptionRRPPEventFilterInput
  ) {
    onCreateRRPPEvent(filter: $filter) {
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
      }
      rrppID
      Tickets {
        nextToken
      }
      rRPPEventEventId
    }
  }
`;
export const onUpdateRRPPEvent = /* GraphQL */ `
  subscription OnUpdateRRPPEvent(
    $filter: ModelSubscriptionRRPPEventFilterInput
  ) {
    onUpdateRRPPEvent(filter: $filter) {
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
      }
      rrppID
      Tickets {
        nextToken
      }
      rRPPEventEventId
    }
  }
`;
export const onDeleteRRPPEvent = /* GraphQL */ `
  subscription OnDeleteRRPPEvent(
    $filter: ModelSubscriptionRRPPEventFilterInput
  ) {
    onDeleteRRPPEvent(filter: $filter) {
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
      }
      rrppID
      Tickets {
        nextToken
      }
      rRPPEventEventId
    }
  }
`;
export const onCreateRRPP = /* GraphQL */ `
  subscription OnCreateRRPP($filter: ModelSubscriptionRRPPFilterInput) {
    onCreateRRPP(filter: $filter) {
      id
      nameRRPP
      surnameRRPP
      dniRRPP
      emailRRPP
      RRPPEvents {
        nextToken
      }
    }
  }
`;
export const onUpdateRRPP = /* GraphQL */ `
  subscription OnUpdateRRPP($filter: ModelSubscriptionRRPPFilterInput) {
    onUpdateRRPP(filter: $filter) {
      id
      nameRRPP
      surnameRRPP
      dniRRPP
      emailRRPP
      RRPPEvents {
        nextToken
      }
    }
  }
`;
export const onDeleteRRPP = /* GraphQL */ `
  subscription OnDeleteRRPP($filter: ModelSubscriptionRRPPFilterInput) {
    onDeleteRRPP(filter: $filter) {
      id
      nameRRPP
      surnameRRPP
      dniRRPP
      emailRRPP
      RRPPEvents {
        nextToken
      }
    }
  }
`;
export const onCreatePayment = /* GraphQL */ `
  subscription OnCreatePayment($filter: ModelSubscriptionPaymentFilterInput) {
    onCreatePayment(filter: $filter) {
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
    }
  }
`;
export const onUpdatePayment = /* GraphQL */ `
  subscription OnUpdatePayment($filter: ModelSubscriptionPaymentFilterInput) {
    onUpdatePayment(filter: $filter) {
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
    }
  }
`;
export const onDeletePayment = /* GraphQL */ `
  subscription OnDeletePayment($filter: ModelSubscriptionPaymentFilterInput) {
    onDeletePayment(filter: $filter) {
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
    }
  }
`;
export const onCreateTicket = /* GraphQL */ `
  subscription OnCreateTicket($filter: ModelSubscriptionTicketFilterInput) {
    onCreateTicket(filter: $filter) {
      id
      qrTicket
      validTicket
      dniTicket
      emailTicket
      eventID
      typeticketID
      rrppeventID
    }
  }
`;
export const onUpdateTicket = /* GraphQL */ `
  subscription OnUpdateTicket($filter: ModelSubscriptionTicketFilterInput) {
    onUpdateTicket(filter: $filter) {
      id
      qrTicket
      validTicket
      dniTicket
      emailTicket
      eventID
      typeticketID
      rrppeventID
    }
  }
`;
export const onDeleteTicket = /* GraphQL */ `
  subscription OnDeleteTicket($filter: ModelSubscriptionTicketFilterInput) {
    onDeleteTicket(filter: $filter) {
      id
      qrTicket
      validTicket
      dniTicket
      emailTicket
      eventID
      typeticketID
      rrppeventID
    }
  }
`;
export const onCreateTypeTicket = /* GraphQL */ `
  subscription OnCreateTypeTicket(
    $filter: ModelSubscriptionTypeTicketFilterInput
  ) {
    onCreateTypeTicket(filter: $filter) {
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
      }
    }
  }
`;
export const onUpdateTypeTicket = /* GraphQL */ `
  subscription OnUpdateTypeTicket(
    $filter: ModelSubscriptionTypeTicketFilterInput
  ) {
    onUpdateTypeTicket(filter: $filter) {
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
      }
    }
  }
`;
export const onDeleteTypeTicket = /* GraphQL */ `
  subscription OnDeleteTypeTicket(
    $filter: ModelSubscriptionTypeTicketFilterInput
  ) {
    onDeleteTypeTicket(filter: $filter) {
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
      }
    }
  }
`;
export const onCreateEvent = /* GraphQL */ `
  subscription OnCreateEvent($filter: ModelSubscriptionEventFilterInput) {
    onCreateEvent(filter: $filter) {
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
      }
      Payments {
        nextToken
      }
      userID
    }
  }
`;
export const onUpdateEvent = /* GraphQL */ `
  subscription OnUpdateEvent($filter: ModelSubscriptionEventFilterInput) {
    onUpdateEvent(filter: $filter) {
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
      }
      Payments {
        nextToken
      }
      userID
    }
  }
`;
export const onDeleteEvent = /* GraphQL */ `
  subscription OnDeleteEvent($filter: ModelSubscriptionEventFilterInput) {
    onDeleteEvent(filter: $filter) {
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
      }
      Payments {
        nextToken
      }
      userID
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      id
      nameUser
      surnameUser
      dniUser
      emailUser
      Events {
        nextToken
      }
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      id
      nameUser
      surnameUser
      dniUser
      emailUser
      Events {
        nextToken
      }
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      id
      nameUser
      surnameUser
      dniUser
      emailUser
      Events {
        nextToken
      }
    }
  }
`;
