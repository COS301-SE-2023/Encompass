import { appCreateEventDataAccess } from './app-calendarPopover-data-access';

describe('appCreateEventDataAccess', () => {
  it('should work', () => {
    expect(appCreateEventDataAccess()).toEqual('app-create-event-data-access');
  });
});
