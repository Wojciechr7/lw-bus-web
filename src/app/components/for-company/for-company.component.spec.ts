import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForCompanyComponent } from './for-company.component';

describe('ForCompanyComponent', () => {
  let component: ForCompanyComponent;
  let fixture: ComponentFixture<ForCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
