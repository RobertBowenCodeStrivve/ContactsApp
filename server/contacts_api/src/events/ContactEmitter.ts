import {EventEmitter} from 'events';
export const contactEventEmitter = new EventEmitter();

export const ContactEventTypes = { //for some reason can't import in vite from @contacts/common? not sure what the issue is
      CREATED: "CREATED",
      UPDATED: "UPDATED",
      DELETED: "DELETED"
  } as const;