import 'package:flutter/material.dart';
import '../models/reminder.dart';

class ReminderWidget extends StatefulWidget {
  final String userType;

  const ReminderWidget({
    super.key,
    required this.userType,
  });

  @override
  State<ReminderWidget> createState() => _ReminderWidgetState();
}

class _ReminderWidgetState extends State<ReminderWidget> {
  bool _showReminders = false;
  String _filter = 'all';

  final List<Reminder> _reminders = [
    Reminder(
      id: '1',
      type: ReminderType.payment,
      title: 'Payment Due Soon',
      message: 'Your monthly payment of \$50 is due on 2025-11-01',
      dueDate: DateTime(2025, 11, 1),
      read: false,
      timestamp: DateTime.now(),
    ),
    Reminder(
      id: '2',
      type: ReminderType.classSchedule,
      title: 'Upcoming Class',
      message: 'You have a Piano class tomorrow at 14:00',
      dueDate: DateTime(2025, 10, 31),
      read: false,
      timestamp: DateTime.now(),
    ),
    Reminder(
      id: '3',
      type: ReminderType.alert,
      title: 'Class Reminder',
      message: 'Don\'t forget your Guitar class in 2 hours',
      dueDate: DateTime(2025, 10, 30),
      read: true,
      timestamp: DateTime.now().subtract(const Duration(hours: 2)),
    ),
  ];

  int get unreadCount => _reminders.where((r) => !r.read).length;

  List<Reminder> get filteredReminders {
    switch (_filter) {
      case 'unread':
        return _reminders.where((r) => !r.read).toList();
      case 'payment':
        return _reminders.where((r) => r.type == ReminderType.payment).toList();
      case 'class':
        return _reminders.where((r) => r.type == ReminderType.classSchedule).toList();
      default:
        return _reminders;
    }
  }

  void _markAsRead(String id) {
    setState(() {
      final index = _reminders.indexWhere((r) => r.id == id);
      if (index != -1) {
        _reminders[index] = _reminders[index].copyWith(read: true);
      }
    });
  }

  void _dismissReminder(String id) {
    setState(() {
      _reminders.removeWhere((r) => r.id == id);
    });
  }

  void _markAllAsRead() {
    setState(() {
      for (int i = 0; i < _reminders.length; i++) {
        _reminders[i] = _reminders[i].copyWith(read: true);
      }
    });
  }

  IconData _getIcon(ReminderType type) {
    switch (type) {
      case ReminderType.payment:
        return Icons.warning_amber;
      case ReminderType.classSchedule:
        return Icons.schedule;
      case ReminderType.alert:
        return Icons.notifications;
    }
  }

  Color _getIconColor(ReminderType type) {
    switch (type) {
      case ReminderType.payment:
        return Colors.yellow.shade700;
      case ReminderType.classSchedule:
        return Colors.blue.shade700;
      case ReminderType.alert:
        return Colors.red.shade700;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        IconButton(
          icon: Stack(
            children: [
              const Icon(Icons.notifications),
              if (unreadCount > 0)
                Positioned(
                  right: 0,
                  top: 0,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(
                      minWidth: 16,
                      minHeight: 16,
                    ),
                    child: Text(
                      '$unreadCount',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
          onPressed: () {
            setState(() {
              _showReminders = !_showReminders;
            });
          },
        ),
        if (_showReminders)
          Positioned(
            top: 56,
            right: 0,
            child: Material(
              elevation: 8,
              borderRadius: BorderRadius.circular(8),
              child: Container(
                width: 350,
                constraints: const BoxConstraints(maxHeight: 500),
                decoration: BoxDecoration(
                  color: Theme.of(context).cardColor,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey.shade300),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Notifications',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.close),
                            onPressed: () {
                              setState(() {
                                _showReminders = false;
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Wrap(
                        spacing: 8,
                        children: [
                          FilterChip(
                            label: const Text('All'),
                            selected: _filter == 'all',
                            onSelected: (selected) {
                              setState(() {
                                _filter = 'all';
                              });
                            },
                          ),
                          FilterChip(
                            label: const Text('Unread'),
                            selected: _filter == 'unread',
                            onSelected: (selected) {
                              setState(() {
                                _filter = 'unread';
                              });
                            },
                          ),
                          FilterChip(
                            label: const Text('Payment'),
                            selected: _filter == 'payment',
                            onSelected: (selected) {
                              setState(() {
                                _filter = 'payment';
                              });
                            },
                          ),
                          FilterChip(
                            label: const Text('Class'),
                            selected: _filter == 'class',
                            onSelected: (selected) {
                              setState(() {
                                _filter = 'class';
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                    const Divider(),
                    Flexible(
                      child: filteredReminders.isEmpty
                          ? const Padding(
                              padding: EdgeInsets.all(32),
                              child: Center(
                                child: Text(
                                  'No reminders',
                                  style: TextStyle(color: Colors.grey),
                                ),
                              ),
                            )
                          : ListView.builder(
                              shrinkWrap: true,
                              itemCount: filteredReminders.length,
                              itemBuilder: (context, index) {
                                final reminder = filteredReminders[index];
                                return Container(
                                  margin: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 4,
                                  ),
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: reminder.read
                                        ? Colors.grey.shade100
                                        : Colors.blue.shade50,
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(
                                      color: reminder.read
                                          ? Colors.grey.shade300
                                          : Colors.blue.shade300,
                                    ),
                                  ),
                                  child: Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Icon(
                                        _getIcon(reminder.type),
                                        color: _getIconColor(reminder.type),
                                        size: 20,
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              reminder.title,
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 14,
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              reminder.message,
                                              style: const TextStyle(fontSize: 12),
                                            ),
                                            if (reminder.dueDate != null)
                                              Text(
                                                'Due: ${reminder.dueDate!.toString().substring(0, 10)}',
                                                style: const TextStyle(
                                                  fontSize: 11,
                                                  color: Colors.grey,
                                                ),
                                              ),
                                          ],
                                        ),
                                      ),
                                      Column(
                                        children: [
                                          if (!reminder.read)
                                            IconButton(
                                              icon: const Icon(Icons.check_circle, size: 18),
                                              onPressed: () => _markAsRead(reminder.id),
                                            ),
                                          IconButton(
                                            icon: const Icon(Icons.close, size: 18),
                                            onPressed: () => _dismissReminder(reminder.id),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                    ),
                    if (unreadCount > 0)
                      Padding(
                        padding: const EdgeInsets.all(8),
                        child: OutlinedButton(
                          onPressed: _markAllAsRead,
                          child: const Text('Mark All as Read'),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }
}
