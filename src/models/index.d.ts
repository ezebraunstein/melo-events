// import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// // @ts-ignore
// import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";





// type EagerTicket = {
//   readonly [__modelMeta__]: {
//     identifier: ManagedIdentifier<Ticket, 'id'>;
//     readOnlyFields: '' | 'updatedAt';
//   };
//   readonly id: string;
//   readonly qrTicket: string;
//   readonly validTicket: boolean;
//   readonly dniTicket: number;
//   readonly emailTicket: string;
//   readonly typeticketID: string;
//   readonly?: string | null;
//   readonly updatedAt?: string | null;
// }

// type LazyTicket = {
//   readonly [__modelMeta__]: {
//     identifier: ManagedIdentifier<Ticket, 'id'>;
//     readOnlyFields: '' | 'updatedAt';
//   };
//   readonly id: string;
//   readonly qrTicket: string;
//   readonly validTicket: boolean;
//   readonly dniTicket: number;
//   readonly emailTicket: string;
//   readonly typeticketID: string;
//   readonly?: string | null;
//   readonly updatedAt?: string | null;
// }

// export declare type Ticket = LazyLoading extends LazyLoadingDisabled ? EagerTicket : LazyTicket

// export declare const Ticket: (new (init: ModelInit<Ticket>) => Ticket) & {
//   copyOf(source: Ticket, mutator: (draft: MutableModel<Ticket>) => MutableModel<Ticket> | void): Ticket;
// }

// type EagerTypeTicket = {
//   readonly [__modelMeta__]: {
//     identifier: ManagedIdentifier<TypeTicket, 'id'>;
//     readOnlyFields: '' | 'updatedAt';
//   };
//   readonly id: string;
//   readonly nameTT: string;
//   readonly priceTT: number;
//   readonly quantityTT: number;
//   readonly descriptionTT?: string | null;
//   readonly activeTT: boolean;
//   readonly startDateTT?: string | null;
//   readonly endDateTT?: string | null;
//   readonly upDateTT?: string | null;
//   readonly downDateTT?: string | null;
//   readonly eventID: string;
//   readonly Tickets?: (Ticket | null)[] | null;
//   readonly?: string | null;
//   readonly updatedAt?: string | null;
// }

// type LazyTypeTicket = {
//   readonly [__modelMeta__]: {
//     identifier: ManagedIdentifier<TypeTicket, 'id'>;
//     readOnlyFields: '' | 'updatedAt';
//   };
//   readonly id: string;
//   readonly nameTT: string;
//   readonly priceTT: number;
//   readonly quantityTT: number;
//   readonly descriptionTT?: string | null;
//   readonly activeTT: boolean;
//   readonly startDateTT?: string | null;
//   readonly endDateTT?: string | null;
//   readonly upDateTT?: string | null;
//   readonly downDateTT?: string | null;
//   readonly eventID: string;
//   readonly Tickets: AsyncCollection<Ticket>;
//   readonly?: string | null;
//   readonly updatedAt?: string | null;
// }

// export declare type TypeTicket = LazyLoading extends LazyLoadingDisabled ? EagerTypeTicket : LazyTypeTicket

// export declare const TypeTicket: (new (init: ModelInit<TypeTicket>) => TypeTicket) & {
//   copyOf(source: TypeTicket, mutator: (draft: MutableModel<TypeTicket>) => MutableModel<TypeTicket> | void): TypeTicket;
// }

// type EagerEvent = {
//   readonly [__modelMeta__]: {
//     identifier: ManagedIdentifier<Event, 'id'>;
//     readOnlyFields: '' | 'updatedAt';
//   };
//   readonly id: string;
//   readonly nameEvent: string;
//   readonly locationEvent?: string | null;
//   readonly descriptionEvent?: string | null;
//   readonly bannerEvent: string;
//   readonly miniBannerEvent?: string | null;
//   readonly startDateE: string;
//   readonly endDateE?: string | null;
//   readonly upDateE?: string | null;
//   readonly downDateE?: string | null;
//   readonly userID: string;
//   readonly TypeTickets?: (TypeTicket | null)[] | null;
//   readonly?: string | null;
//   readonly updatedAt?: string | null;
// }

// type LazyEvent = {
//   readonly [__modelMeta__]: {
//     identifier: ManagedIdentifier<Event, 'id'>;
//     readOnlyFields: '' | 'updatedAt';
//   };
//   readonly id: string;
//   readonly nameEvent: string;
//   readonly locationEvent?: string | null;
//   readonly descriptionEvent?: string | null;
//   readonly bannerEvent: string;
//   readonly miniBannerEvent?: string | null;
//   readonly startDateE: string;
//   readonly endDateE?: string | null;
//   readonly upDateE?: string | null;
//   readonly downDateE?: string | null;
//   readonly userID: string;
//   readonly TypeTickets: AsyncCollection<TypeTicket>;
//   readonly?: string | null;
//   readonly updatedAt?: string | null;
// }

// export declare type Event = LazyLoading extends LazyLoadingDisabled ? EagerEvent : LazyEvent

// export declare const Event: (new (init: ModelInit<Event>) => Event) & {
//   copyOf(source: Event, mutator: (draft: MutableModel<Event>) => MutableModel<Event> | void): Event;
// }

// type EagerUser = {
//   readonly [__modelMeta__]: {
//     identifier: ManagedIdentifier<User, 'id'>;
//     readOnlyFields: '' | 'updatedAt';
//   };
//   readonly id: string;
//   readonly nameUser: string;
//   readonly surnameUser: string;
//   readonly dniUser: number;
//   readonly emailUser: string;
//   readonly aliasUser: string;
//   readonly Events?: (Event | null)[] | null;
//   readonly?: string | null;
//   readonly updatedAt?: string | null;
// }

// type LazyUser = {
//   readonly [__modelMeta__]: {
//     identifier: ManagedIdentifier<User, 'id'>;
//     readOnlyFields: '' | 'updatedAt';
//   };
//   readonly id: string;
//   readonly nameUser: string;
//   readonly surnameUser: string;
//   readonly dniUser: number;
//   readonly emailUser: string;
//   readonly aliasUser: string;
//   readonly Events: AsyncCollection<Event>;
//   readonly?: string | null;
//   readonly updatedAt?: string | null;
// }

// export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

// export declare const User: (new (init: ModelInit<User>) => User) & {
//   copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
// }