import 'package:flutter/material.dart';
import 'student_dashboard_screen.dart';
import 'teacher_dashboard_screen.dart';
import 'login_screen.dart';

class HomeScreen extends StatefulWidget {
  final String userType; // 'student' or 'teacher'
  
  const HomeScreen({super.key, required this.userType});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;
  late List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    // If student, only show student dashboard
    // If teacher, show both dashboards
    if (widget.userType == 'student') {
      _screens = [const StudentDashboardScreen()];
    } else {
      _screens = [
        const StudentDashboardScreen(),
        const TeacherDashboardScreen(),
      ];
    }
  }

  void _logout() {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (context) => const LoginScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _logout,
            tooltip: 'Logout',
          ),
        ],
      ),
      body: _screens[_selectedIndex],
      bottomNavigationBar: widget.userType == 'teacher'
          ? NavigationBar(
              selectedIndex: _selectedIndex,
              onDestinationSelected: (index) {
                setState(() {
                  _selectedIndex = index;
                });
              },
              destinations: const [
                NavigationDestination(
                  icon: Icon(Icons.person),
                  label: 'Student View',
                ),
                NavigationDestination(
                  icon: Icon(Icons.school),
                  label: 'Teacher',
                ),
              ],
            )
          : null, // No bottom nav for students
    );
  }
}
