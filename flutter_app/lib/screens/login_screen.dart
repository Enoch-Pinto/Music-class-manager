import 'package:flutter/material.dart';
import 'home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _studentUsernameController = TextEditingController();
  final _studentPasswordController = TextEditingController();
  final _teacherUsernameController = TextEditingController();
  final _teacherPasswordController = TextEditingController();

  // Mock credentials
  final Map<String, Map<String, String>> _credentials = {
    'student': {'username': 'student', 'password': 'student123'},
    'teacher': {'username': 'teacher', 'password': 'teacher123'},
  };

  @override
  void dispose() {
    _studentUsernameController.dispose();
    _studentPasswordController.dispose();
    _teacherUsernameController.dispose();
    _teacherPasswordController.dispose();
    super.dispose();
  }

  void _login(String userType) {
    final username = userType == 'student'
        ? _studentUsernameController.text
        : _teacherUsernameController.text;
    final password = userType == 'student'
        ? _studentPasswordController.text
        : _teacherPasswordController.text;

    if (username == _credentials[userType]!['username'] &&
        password == _credentials[userType]!['password']) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (context) => HomeScreen(userType: userType),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Invalid credentials. Try:\nUsername: $userType\nPassword: ${userType}123',
          ),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Widget _buildLoginCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required Color buttonColor,
    required TextEditingController usernameController,
    required TextEditingController passwordController,
    required VoidCallback onLogin,
    required String demoCredentials,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: iconColor.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                size: 48,
                color: iconColor,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              title,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey.shade600,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            TextField(
              controller: usernameController,
              decoration: InputDecoration(
                labelText: 'Username',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.person),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: passwordController,
              decoration: InputDecoration(
                labelText: 'Password',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                prefixIcon: const Icon(Icons.lock),
              ),
              obscureText: true,
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: onLogin,
                style: ElevatedButton.styleFrom(
                  backgroundColor: buttonColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  'Login as $title',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Demo: $demoCredentials',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Colors.blue.shade50,
              Colors.indigo.shade100,
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Logo and Title
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.blue.shade600,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.music_note,
                      size: 48,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Music Class Manager',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Choose your role to continue',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey.shade700,
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Login Cards
                  LayoutBuilder(
                    builder: (context, constraints) {
                      if (constraints.maxWidth > 900) {
                        // Desktop/Tablet - Side by side
                        return Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: _buildLoginCard(
                                title: 'Student',
                                subtitle: 'Track your classes & payments',
                                icon: Icons.person,
                                iconColor: Colors.blue,
                                buttonColor: Colors.blue,
                                usernameController: _studentUsernameController,
                                passwordController: _studentPasswordController,
                                onLogin: () => _login('student'),
                                demoCredentials: 'student / student123',
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: _buildLoginCard(
                                title: 'Teacher',
                                subtitle: 'Manage classes & students',
                                icon: Icons.school,
                                iconColor: Colors.indigo,
                                buttonColor: Colors.indigo,
                                usernameController: _teacherUsernameController,
                                passwordController: _teacherPasswordController,
                                onLogin: () => _login('teacher'),
                                demoCredentials: 'teacher / teacher123',
                              ),
                            ),
                          ],
                        );
                      } else {
                        // Mobile - Stacked
                        return Column(
                          children: [
                            _buildLoginCard(
                              title: 'Student',
                              subtitle: 'Track your classes & payments',
                              icon: Icons.person,
                              iconColor: Colors.blue,
                              buttonColor: Colors.blue,
                              usernameController: _studentUsernameController,
                              passwordController: _studentPasswordController,
                              onLogin: () => _login('student'),
                              demoCredentials: 'student / student123',
                            ),
                            const SizedBox(height: 16),
                            _buildLoginCard(
                              title: 'Teacher',
                              subtitle: 'Manage classes & students',
                              icon: Icons.school,
                              iconColor: Colors.indigo,
                              buttonColor: Colors.indigo,
                              usernameController: _teacherUsernameController,
                              passwordController: _teacherPasswordController,
                              onLogin: () => _login('teacher'),
                              demoCredentials: 'teacher / teacher123',
                            ),
                          ],
                        );
                      }
                    },
                  ),

                  const SizedBox(height: 32),

                  // Features
                  Text(
                    'Manage your music classes with ease',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey.shade700,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 16,
                    runSpacing: 8,
                    alignment: WrapAlignment.center,
                    children: [
                      _buildFeature('Schedule Management'),
                      _buildFeature('Payment Tracking'),
                      _buildFeature('Notifications'),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFeature(String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          Icons.check_circle,
          size: 20,
          color: Colors.green.shade600,
        ),
        const SizedBox(width: 4),
        Text(
          text,
          style: TextStyle(
            fontSize: 14,
            color: Colors.grey.shade700,
          ),
        ),
      ],
    );
  }
}
