import 'package:flutter/material.dart';
import '../models/music_class.dart';

class StudentPaymentInfo {
  final String student;
  final String instrument;
  final String lastClass;
  final int totalClasses;
  final int paidClasses;
  final double unpaidAmount;
  final String status;

  StudentPaymentInfo({
    required this.student,
    required this.instrument,
    required this.lastClass,
    required this.totalClasses,
    required this.paidClasses,
    required this.unpaidAmount,
    required this.status,
  });
}

class PaymentTrackingWidget extends StatefulWidget {
  final List<MusicClass> classes;

  const PaymentTrackingWidget({
    super.key,
    required this.classes,
  });

  @override
  State<PaymentTrackingWidget> createState() => _PaymentTrackingWidgetState();
}

class _PaymentTrackingWidgetState extends State<PaymentTrackingWidget> {
  final Map<String, bool> _reminders = {};
  final TextEditingController _messageController = TextEditingController();

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  List<StudentPaymentInfo> _getStudentPayments() {
    final Map<String, List<MusicClass>> studentClasses = {};

    for (var cls in widget.classes) {
      if (!studentClasses.containsKey(cls.student)) {
        studentClasses[cls.student] = [];
      }
      studentClasses[cls.student]!.add(cls);
    }

    return studentClasses.entries.map((entry) {
      final student = entry.key;
      final classes = entry.value;
      final totalClasses = classes.length;
      final paidClasses = classes.where((c) => c.paid).length;
      final unpaidAmount = (totalClasses - paidClasses) * 50.0;
      final status = unpaidAmount > 0 ? 'pending' : 'paid';

      return StudentPaymentInfo(
        student: student,
        instrument: classes.first.instrument,
        lastClass: classes.last.date.toString().substring(0, 10),
        totalClasses: totalClasses,
        paidClasses: paidClasses,
        unpaidAmount: unpaidAmount,
        status: status,
      );
    }).toList();
  }

  void _sendReminder(String student) {
    setState(() {
      _reminders[student] = true;
    });

    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        setState(() {
          _reminders[student] = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final studentPayments = _getStudentPayments();
    final pendingPayments = studentPayments.where((p) => p.status == 'pending').length;
    final paidStudents = studentPayments.where((p) => p.status == 'paid').length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Summary Stats
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
                                'Total Students',
                                style: TextStyle(fontSize: 12),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                '${studentPayments.length}',
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
                            child: Icon(Icons.people, color: Colors.blue.shade700),
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
                                'Pending',
                                style: TextStyle(fontSize: 12),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                '$pendingPayments',
                                style: TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.yellow.shade700,
                                ),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.yellow.shade100,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Icon(Icons.warning, color: Colors.yellow.shade700),
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
                      'Paid Students',
                      style: TextStyle(fontSize: 12),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '$paidStudents',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.green.shade700,
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
                  child: Icon(Icons.check_circle, color: Colors.green.shade700),
                ),
              ],
            ),
          ),
        ),

        const SizedBox(height: 16),

        // Student Payment List
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Payment Status by Student',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Track payment status and send reminders',
                  style: TextStyle(color: Colors.grey),
                ),
                const SizedBox(height: 16),
                ...studentPayments.map((payment) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: payment.status == 'paid'
                          ? Colors.green.shade50
                          : Colors.yellow.shade50,
                      border: Border.all(
                        color: payment.status == 'paid'
                            ? Colors.green.shade300
                            : Colors.yellow.shade300,
                      ),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                payment.student,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '${payment.paidClasses}/${payment.totalClasses} classes paid',
                                style: const TextStyle(fontSize: 12),
                              ),
                              if (payment.unpaidAmount > 0)
                                Text(
                                  'Outstanding: \$${payment.unpaidAmount.toStringAsFixed(0)}',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: payment.status == 'paid'
                                ? Colors.green.shade200
                                : Colors.yellow.shade200,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            payment.status.toUpperCase(),
                            style: TextStyle(
                              color: payment.status == 'paid'
                                  ? Colors.green.shade900
                                  : Colors.yellow.shade900,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        if (payment.status != 'paid')
                          OutlinedButton(
                            onPressed: () => _sendReminder(payment.student),
                            child: Text(
                              _reminders[payment.student] == true ? 'Sent' : 'Remind',
                            ),
                          ),
                      ],
                    ),
                  );
                }),
              ],
            ),
          ),
        ),

        const SizedBox(height: 16),

        // Reminder Template
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Send Payment Reminder',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Customize and send payment reminders to students',
                  style: TextStyle(color: Colors.grey),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _messageController,
                  decoration: const InputDecoration(
                    labelText: 'Message Template',
                    border: OutlineInputBorder(),
                    hintText:
                        'Hi {student}, this is a friendly reminder that your payment of \${amount} is due...',
                  ),
                  maxLines: 4,
                ),
                const SizedBox(height: 12),
                ElevatedButton(
                  onPressed: () {},
                  child: const Text('Send Reminders to All Pending'),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
