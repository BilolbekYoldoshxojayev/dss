# NamPS OS — Anonymity & Privacy Design

## 1. Zero Identity Collection Architecture
The Anonymous Student Suggestion subsystem is designed from the ground up to prevent identity tracking:
- **No Authentication Required**: Submitting an anonymous suggestion requires no login, student account, or identity confirmation.
- **Zero Foreign Keys**: The `anonymous_suggestions` database table has NO `user_id`, NO `student_id`, NO `class_id`, and NO `email` column.
- **No IP Address Storage**: Neither client IP addresses nor User-Agent strings are stored in application database records.
- **No Log Leaks**: Suggestion request bodies and raw suggestion text are excluded from persistent server logs.

## 2. Dual Receipt Credential Mechanism
Upon successful submission, the system generates two values:
1. **Public Receipt Code**: A human-friendly, non-identifying identifier (e.g. `NPS-7K9W2B4X`).
2. **Private Secret Token**: A high-entropy 256-bit cryptographically random token (`sec_` + 64 hex characters).

### Verifier Storage
- The private secret token is **never stored** in the database.
- Only a cryptographic verifier hash (`SHA-256(token + pepper)`) is stored.
- When a student checks the suggestion's status, the server hashes the provided secret token and performs a **timing-safe comparison** against the stored verifier.
- Without the secret token, nobody (including school staff or database administrators) can generate a valid status request.

## 3. Reviewer Workflow
- **Director & Manager Access**: The Director and Manager can review submitted suggestion text, assign categories, update statuses (`Received`, `Under Review`, `Approved`, `Denied`, `In Progress`, `Implemented`, `Closed`), and author an official leadership response.
- **Zero Identity Display**: The review interface displays only the suggestion's receipt code, category, timestamp, title, and body. It is impossible to reveal the author because the application never stored it.

## 4. Honest Threat Model & Infrastructure Limitations
- **Application-Level Anonymity**: Guaranteed at the application and database layer.
- **Connection Metadata**: Network routing equipment, upstream firewalls, or cloud hosting platforms (e.g. edge CDN access logs) may temporarily log TCP/IP connection metadata outside the application's control.
- **Self-Identification**: The system displays a prominent warning advising students not to write self-identifying details (names, specific personal anecdotes) inside the suggestion body.
