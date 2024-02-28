// employee-list.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/manage-employee.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];

  constructor(private employeeService: EmployeeService, private router: Router, private toast: NgToastService) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employees = this.employeeService.getAllEmployees();
  }

  deleteEmployee(id: string,name: string) {
    if (confirm(`Are you sure you want to delete ${name.toUpperCase()}?`)) {
      this.employeeService.deleteEmployee(id);
      this.loadEmployees();
      this.toast.success(
        {
          detail: `The Employee ${name} is deleted successfully.`,
          duration: 2000,
        }
      )
    }
  }

  editEmployee(id: string) {
    this.router.navigate(['employee/edit/', id]);
  }
}
