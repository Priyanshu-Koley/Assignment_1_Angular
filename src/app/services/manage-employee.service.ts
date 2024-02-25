import { Injectable } from '@angular/core';
import Employee from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: any[] = [];

  constructor() { }

  getAllEmployees(): Employee[] {
    return this.employees;
  }

  addEmployee(employee: Employee): void {
    employee.id = this.generateEmployeeId(); // Assigning an ID (you may use a better approach in real scenarios)
    this.employees.push(employee);
  }

  updateEmployee(id: number, employee: Employee): void {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.employees[index] = employee;
      this.employees[index].id = id;
    }
  }

  deleteEmployee(id: number): void {
    this.employees = this.employees.filter(emp => emp.id !== id);
  }

  getEmployeeById(id: number): Employee {
    return this.employees.find(emp => emp.id === id);
  }
  
  private generateEmployeeId(): number {
    if(this.employees.length===0)
      return 0;
    else
      return this.employees[this.employees.length-1].id++;

  }
}
