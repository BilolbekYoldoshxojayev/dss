# NamPS OS — Permissions & Access Control Matrix

## Role Hierarchy & Resource Matrix

| Resource | Director | Manager | Teacher | Student | Parent | Public / Unauth |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| School Analytics & Reports | Full | Read | Restricted | Denied | Denied | Denied |
| User Provisioning | Full | Full | Denied | Denied | Denied | Denied |
| Timetable Management | Full | Full | Assigned Only | Personal Only | Child Only | Denied |
| Assignment Creation | Full | Read | Assigned Only | Denied | Denied | Denied |
| Assignment Submission | Denied | Denied | Denied | Own Only | Read Child | Denied |
| Assignment Grading | Full | Read | Assigned Only | Denied | Denied | Denied |
| Attendance Recording | Full | Full | Assigned Only | Denied | Denied | Denied |
| Attendance Viewing | Full | Full | Assigned Only | Own Only | Child Only | Denied |
| Anonymous Suggestion Submission | Submit | Submit | Submit | Submit | Submit | **Submit (Allowed)** |
| Anonymous Suggestion Review | **Full** | **Full** | Denied | Denied | Denied | Denied |
| Anonymous Status Lookup | Credential | Credential | Credential | Credential | Credential | **Credential Only** |
| Bulk CSV Import/Export | Full | Full | Denied | Denied | Denied | Denied |
| Support Ticket Creation | Full | Full | Create | Create | Create | Denied |
| Support Ticket Disposition | Full | Full | Denied | Denied | Denied | Denied |

*Director has executive school-wide oversight but CANNOT access author identities for anonymous suggestions because no author records exist.*
