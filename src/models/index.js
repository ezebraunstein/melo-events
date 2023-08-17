// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Ticket, TypeTicket, Event, User } = initSchema(schema);

export {
  Ticket,
  TypeTicket,
  Event,
  User
};