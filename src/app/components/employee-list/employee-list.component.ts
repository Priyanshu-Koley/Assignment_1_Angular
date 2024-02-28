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
  employees: any[] = []; // Array to store the list of employees

  constructor(private employeeService: EmployeeService, private router: Router, private toast: NgToastService) { }

  ngOnInit(): void {
    this.loadEmployees(); // Call method to load employees when component initializes
  }

  // Method to load employees from the service
  loadEmployees() {
    this.employees = this.employeeService.getAllEmployees();
  }

  // Method to delete an employee
  deleteEmployee(id: string, name: string) {
    // Confirm deletion with user
    if (confirm(`Are you sure you want to delete ${name.toUpperCase()}?`)) {
      // Call service to delete employee
      this.employeeService.deleteEmployee(id);
      // Reload the list of employees
      this.loadEmployees();
      // Show success toast after deletion
      this.toast.success(
        {
          detail: `The Employee ${name} is deleted successfully.`,
          duration: 2000,
        }
      )
    }
  }

  // Method to navigate to edit employee page
  editEmployee(id: string) {
    this.router.navigate(['employee/edit/', id]);
  }
}
