import { TaskMangementRoutingModule } from './task-mangement-routing.module';

describe('TaskMangementRoutingModule', () => {
  let taskMangementRoutingModule: TaskMangementRoutingModule;

  beforeEach(() => {
    taskMangementRoutingModule = new TaskMangementRoutingModule();
  });

  it('should create an instance', () => {
    expect(taskMangementRoutingModule).toBeTruthy();
  });
});
