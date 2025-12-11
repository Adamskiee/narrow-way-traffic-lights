# IoT-Based Smart Traffic Light System for Narrow Roads

## Project Overview

This project implements a **smart traffic light system specifically designed for narrow or single-lane roads**, where vehicles from opposite directions cannot pass simultaneously. The system integrates **IoT technology**, a **camera for real-time traffic monitoring**, and a **web-based interface** for remote traffic light control. It ensures **safe, efficient, and alternating traffic flow** while providing robust user management and control functionalities.

---

## Features

- **Traffic Flow Logs:** Maintains detailed logs for traffic light operations.
- **Traffic Light Error Detection:** Automatically detects and reports traffic light malfunctions.
- **Emergency Override:** Emergency button that switches all traffic lights to red immediately.
- **Scheduled Timing:** Allows defining default traffic light durations.
- **Manual and Automatic Modes:** Switch between fully automatic operation or manual control.
- **Temporary Override:** Admins and operators can temporarily override default traffic light durations during operations.
- **User Roles and Permissions:**
  - **Superadmin:** Can create Admin accounts.
  - **Admin:** Can create Operator accounts, manage overrides, and ban operators.
  - **Operator:** Only one active operator allowed to control traffic lights at a time.
- **Safety and Control:** Ensures proper alternating flow for narrow or single-lane roads.

---

## System Components

- **ESP-32-MB:** Microcontroller controlling traffic lights and handling IoT communication.
- **LEDs:** Traffic lights for signaling.
- **Camera:** Monitors real-time traffic flow.
- **Web App:** Dashboard for monitoring, controlling traffic lights, and managing users.

---

## License

MIT License

---

## Contact

For questions or contributions, contact: Adriele Tosino – <tosinomatthew@gmail.com>
