import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/class_provider.dart';
import '../models/music_class.dart';
import '../widgets/calendar_widget.dart';
import '../widgets/reminder_widget.dart';
import '../widgets/payment_tracking_widget.dart';

class TeacherDashboardScreen extends StatefulWidget {
  const TeacherDashboardScreen({super.key});

  @override
  State<TeacherDashboardScreen> createState() => _TeacherDashboardScreenState();
}

class _TeacherDashboardScreenState extends State<TeacherDashboardScreen> {
  bool _showScheduleForm = false;
  String _filterInstrument = 'all';
  String _activeTab = 'classes';

  final _studentController = TextEditingController();
  final _dateController = TextEditingController();
  final _timeController = TextEditingController();
  final _instrumentController = TextEditingController();
  final _notesController = TextEditingController();

  @override
  void dispose() {
    _studentController.dispose();
    _dateController.dispose();
    _timeController.dispose();
    _instrumentController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _scheduleClass(ClassProvider provider) {
    if (_studentController.text.isEmpty ||
        _dateController.text.isEmpty ||
        _timeController.text.isEmpty ||
        _instrumentController.text.isEmpty) {
      return;
    }

    final newClass = MusicClass(
      id: provider.nextId,
      student: _studentController.text,
      date: DateTime.parse(_dateController.text),
      time: _timeController.text,
      instrument: _instrumentController.text,
      notes: _notesController.text.isEmpty ? null : _notesController.text,
    );

    provider.addClass(newClass);

    _studentController.clear();
    _dateController.clear();
    _timeController.clear();
    _instrumentController.clear();
    _notesController.clear();

    setState(() {
      _showScheduleForm = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Teacher Dashboard', style: TextStyle(fontWeight: FontWeight.bold)),
            Text(
              'Manage your music classes and schedule',
              style: TextStyle(fontSize: 12),
            ),
          ],
        ),
        actions: [
          const ReminderWidget(userType: 'teacher'),
          IconButton(
            icon: Icon(_showScheduleForm ? Icons.close : Icons.add),
            onPressed: () {
              setState(() {
                _showScheduleForm = !_showScheduleForm;
              });
            },
          ),
        ],
      ),
      body: Consumer<ClassProvider>(
        builder: (context, classProvider, child) {
          final upcomingClasses = classProvider.getUpcomingClasses().length;
          final totalRevenue = classProvider.classes.where((c) => c.paid).length * 50;
          final instruments = classProvider.classes
              .map((c) => c.instrument)
              .toSet()
              .toList();

          final filteredClasses = _filterInstrument == 'all'
              ? classProvider.classes
              : classProvider.getClassesByInstrument(_filterInstrument);

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Stats Cards
                Row(
                  children: [
                    Expanded(
                      child: Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Total Classes',
                                        style: TextStyle(fontSize: 12),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        '${classProvider.classes.length}',
                                        style: const TextStyle(
                                          fontSize: 28,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                  Container(
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Colors.blue.shade100,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Icon(Icons.music_note, color: Colors.blue.shade700),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Upcoming',
                                        style: TextStyle(fontSize: 12),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        '$upcomingClasses',
                                        style: const TextStyle(
                                          fontSize: 28,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                  Container(
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Colors.orange.shade100,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Icon(Icons.schedule, color: Colors.orange.shade700),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 8),

                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Revenue (Paid)',
                              style: TextStyle(fontSize: 12),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              '\$$totalRevenue',
                              style: const TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.green.shade100,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Icon(Icons.attach_money, color: Colors.green.shade700),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // Tab Navigation
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          setState(() {
                            _activeTab = 'classes';
                          });
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _activeTab == 'classes'
                              ? Theme.of(context).colorScheme.primary
                              : Colors.grey.shade300,
                        ),
                        child: Text(
                          'Classes',
                          style: TextStyle(
                            color: _activeTab == 'classes' ? Colors.white : Colors.black,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          setState(() {
                            _activeTab = 'payments';
                          });
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _activeTab == 'payments'
                              ? Theme.of(context).colorScheme.primary
                              : Colors.grey.shade300,
                        ),
                        child: Text(
                          'Payments',
                          style: TextStyle(
                            color: _activeTab == 'payments' ? Colors.white : Colors.black,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                if (_activeTab == 'classes') ...[
                  // Schedule Form
                  if (_showScheduleForm)
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Schedule New Class',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            TextField(
                              controller: _studentController,
                              decoration: const InputDecoration(
                                labelText: 'Student Name',
                                border: OutlineInputBorder(),
                              ),
                            ),
                            const SizedBox(height: 12),
                            TextField(
                              controller: _dateController,
                              decoration: const InputDecoration(
                                labelText: 'Date (YYYY-MM-DD)',
                                border: OutlineInputBorder(),
                              ),
                              keyboardType: TextInputType.datetime,
                            ),
                            const SizedBox(height: 12),
                            TextField(
                              controller: _timeController,
                              decoration: const InputDecoration(
                                labelText: 'Time (HH:MM)',
                                border: OutlineInputBorder(),
                              ),
                            ),
                            const SizedBox(height: 12),
                            TextField(
                              controller: _instrumentController,
                              decoration: const InputDecoration(
                                labelText: 'Instrument',
                                border: OutlineInputBorder(),
                              ),
                            ),
                            const SizedBox(height: 12),
                            TextField(
                              controller: _notesController,
                              decoration: const InputDecoration(
                                labelText: 'Notes (Optional)',
                                border: OutlineInputBorder(),
                              ),
                              maxLines: 3,
                            ),
                            const SizedBox(height: 12),
                            ElevatedButton(
                              onPressed: () => _scheduleClass(classProvider),
                              child: const Text('Create Class'),
                            ),
                          ],
                        ),
                      ),
                    ),

                  const SizedBox(height: 16),

                  // Calendar
                  CalendarWidget(
                    classes: classProvider.classes,
                    userType: 'teacher',
                  ),

                  const SizedBox(height: 16),

                  // Filter
                  Wrap(
                    spacing: 8,
                    children: [
                      FilterChip(
                        label: const Text('All'),
                        selected: _filterInstrument == 'all',
                        onSelected: (selected) {
                          setState(() {
                            _filterInstrument = 'all';
                          });
                        },
                      ),
                      ...instruments.map((instrument) {
                        return FilterChip(
                          label: Text(instrument),
                          selected: _filterInstrument == instrument,
                          onSelected: (selected) {
                            setState(() {
                              _filterInstrument = instrument;
                            });
                          },
                        );
                      }),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Classes List
                  const Text(
                    'Scheduled Classes',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),

                  if (filteredClasses.isEmpty)
                    const Card(
                      child: Padding(
                        padding: EdgeInsets.all(32),
                        child: Center(
                          child: Text('No classes scheduled'),
                        ),
                      ),
                    )
                  else
                    ...filteredClasses.map((cls) {
                      return Card(
                        margin: const EdgeInsets.only(bottom: 8),
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  const Icon(Icons.person, size: 16),
                                  const SizedBox(width: 4),
                                  Text(
                                    cls.student,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                cls.instrument,
                                style: const TextStyle(color: Colors.grey),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  const Icon(Icons.calendar_today, size: 14),
                                  const SizedBox(width: 4),
                                  Text(
                                    '${DateFormat('yyyy-MM-dd').format(cls.date)} at ${cls.time}',
                                    style: const TextStyle(fontSize: 12),
                                  ),
                                ],
                              ),
                              if (cls.notes != null) ...[
                                const SizedBox(height: 4),
                                Text(
                                  cls.notes!,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontStyle: FontStyle.italic,
                                  ),
                                ),
                              ],
                              const SizedBox(height: 12),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 6,
                                    ),
                                    decoration: BoxDecoration(
                                      color: cls.paid
                                          ? Colors.green.shade100
                                          : Colors.red.shade100,
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: Text(
                                      cls.paid ? 'Paid' : 'Unpaid',
                                      style: TextStyle(
                                        color: cls.paid
                                            ? Colors.green.shade800
                                            : Colors.red.shade800,
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                  Row(
                                    children: [
                                      OutlinedButton(
                                        onPressed: () {
                                          classProvider.togglePaidStatus(cls.id);
                                        },
                                        child: Text(cls.paid ? 'Mark Unpaid' : 'Mark Paid'),
                                      ),
                                      const SizedBox(width: 8),
                                      IconButton(
                                        icon: const Icon(Icons.delete, color: Colors.red),
                                        onPressed: () {
                                          classProvider.deleteClass(cls.id);
                                        },
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                ],

                if (_activeTab == 'payments')
                  PaymentTrackingWidget(classes: classProvider.classes),
              ],
            ),
          );
        },
      ),
    );
  }
}
