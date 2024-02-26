import { Injectable } from '@angular/core';
import Employee from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employees: any[] = [];

  constructor() {}

  getAllEmployees(): Employee[] {
    return this.employees;
  }

  addEmployee(employee: Employee): void {
    this.employees.push(employee);
  }

  updateEmployee(id: string, employee: Employee): void {
    const index = this.employees.findIndex((emp) => emp.id === id);
    if (index !== -1) {
      this.employees[index] = employee;
      this.employees[index].id = id;
    }
  }

  deleteEmployee(id: string): void {
    this.employees = this.employees.filter((emp) => emp.id !== id);
  }

  getEmployeeById(id: string): Employee {
    return this.employees.find((emp) => emp.id === id);
  }
}
