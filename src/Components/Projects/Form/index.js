import { useEffect, useState } from 'react';
import styles from './form.module.css';

const Form = () => {
  const [projectAdd, setProjectAdd] = useState({
    name: '',
    clientName: '',
    description: '',
    startDate: '',
    endDate: '',
    employees: []
  });
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeProject, setEmployeeProject] = useState({
    rate: null,
    role: '',
    employee: ''
  });
  const [errorMessage, setErrorMessage] = useState();
  const [form, setForm] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/employees`)
      .then((response) => response.json())
      .then((response) => {
        setEmployeeList(response.data);
      });
  }, []);

  const formatDate = (date) => {
    const dateIso = date.substr(0, 10);
    return dateIso;
  };

  useEffect(async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/projects/${id}`, {
          method: 'GET'
        });
        const project = await response.json();
        const employeeList = [];
        project.data.employees.map((item) => {
          delete item.employee.name;
          delete item.employee.email;
          delete item.employee.lastName;
          delete item.employee.password;
          delete item.employee.phone;
          let employeeId = item.employee._id;
          item.employee = employeeId;
          employeeList.push(item);
        });
        setProjectAdd({
          name: project.data.name,
          clientName: project.data.clientName,
          description: project.data.description,
          startDate: project.data.startDate,
          endDate: project.data.endDate,
          employees: employeeList
        });
        setForm(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      return null;
    }
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
  };

  const deleteEmployees = (id) => {
    setProjectAdd({
      ...projectAdd,
      employees: projectAdd.employees.filter((employee) => employee.employee !== id)
    });
  };

  const formProjects = async (projectAdd) => {
    if (form) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(projectAdd)
        });
        const data = await response.json();
        if (!data.error) {
          window.location.href = '/projects';
        } else {
          setErrorMessage(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      try {
        const url = window.location.href;
        const id = url.substring(url.lastIndexOf('=') + 1);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/projects/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(projectAdd)
        });
        const data = await response.json();
        if (!data.error) {
          window.location.href = '/projects';
        } else {
          setErrorMessage(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h3>{errorMessage}</h3>
      </div>
      <form onSubmit={onSubmit}>
        <h2>Form</h2>
        <div className={styles.projectForm}>
          <div>
            <label>Name</label>
            <input
              className={styles.input}
              id="name"
              name="name"
              value={projectAdd.name}
              onChange={(e) => {
                setProjectAdd({
                  ...projectAdd,
                  name: e.target.value
                });
              }}
            />
            <label>Client Name</label>
            <input
              className={styles.input}
              id="clientName"
              name="clientName"
              value={projectAdd.clientName}
              onChange={(e) => {
                setProjectAdd({
                  ...projectAdd,
                  clientName: e.target.value
                });
              }}
            />
          </div>
          <div>
            <label>Description</label>
            <input
              className={styles.input}
              id="description"
              name="description"
              value={projectAdd.description}
              onChange={(e) => {
                setProjectAdd({
                  ...projectAdd,
                  description: e.target.value
                });
              }}
            />
          </div>
          <div>
            <label>Start Date</label>
            <input
              className={styles.input}
              id="startDate"
              name="startDate"
              type="date"
              value={formatDate(projectAdd.startDate)}
              onChange={(e) => {
                let dateFormatted = new Date(e.target.value).toISOString();
                setProjectAdd({
                  ...projectAdd,
                  startDate: dateFormatted
                });
              }}
            />
            <label>End Date</label>
            <input
              className={styles.input}
              id="endDate"
              name="endDate"
              type="date"
              value={formatDate(projectAdd.endDate)}
              onChange={(e) => {
                let dateFormatted = new Date(e.target.value).toISOString();
                setProjectAdd({
                  ...projectAdd,
                  endDate: dateFormatted
                });
              }}
            />
          </div>
        </div>
        <h3>Employees</h3>
        <div className={styles.employeeForm}>
          <div>
            <label>Employees</label>
            <select
              name="role"
              id="role"
              required
              onChange={(e) => {
                setEmployeeProject({
                  ...employeeProject,
                  employee: e.target.value
                });
              }}
            >
              <option value="" disabled hidden selected>
                Select Employee
              </option>
              {employeeList.map((employee) => {
                return (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label>Role</label>
            <select
              name="role"
              id="role"
              onChange={(e) => {
                setEmployeeProject({
                  ...employeeProject,
                  role: e.target.value
                });
              }}
            >
              <option value="" disabled hidden selected>
                Select Rol
              </option>
              <option value="DEV">DEV</option>
              <option value="TL">TL</option>
              <option value="PM">PM</option>
              <option value="QA">QA</option>
            </select>
          </div>
          <div>
            <label>Rate</label>
            <input
              name="rate"
              id="rate"
              onChange={(e) => {
                setEmployeeProject({
                  ...employeeProject,
                  rate: e.target.value
                });
              }}
            ></input>
          </div>
          <div>
            <button
              onClick={() => {
                setProjectAdd({
                  ...projectAdd,
                  employees: [...projectAdd.employees, employeeProject]
                });
              }}
            >
              Assign Employee
            </button>
          </div>
        </div>
        <div className={styles.employees}>
          {projectAdd.employees.map((employee) => {
            const currentEmployee = employeeList.find((item) => item._id === employee.employee);
            if (currentEmployee) {
              return (
                <tr key={employee.employee} className={styles.employeeList}>
                  <td>{currentEmployee.name}</td>
                  <td>{employee.role}</td>
                  <td>{employee.rate}</td>
                  <td>
                    <button
                      onClick={() => {
                        deleteEmployees(employee.employee);
                      }}
                    >
                      X
                    </button>
                  </td>
                </tr>
              );
            }
          })}
        </div>
        <div className={styles.save}>
          <button
            type="submit"
            onClick={() => {
              formProjects(projectAdd);
            }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
