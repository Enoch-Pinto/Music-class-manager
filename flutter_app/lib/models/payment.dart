class Payment {
  final int id;
  final DateTime date;
  final double amount;
  final PaymentStatus status;
  final String method;

  Payment({
    required this.id,
    required this.date,
    required this.amount,
    required this.status,
    required this.method,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'date': date.toIso8601String(),
      'amount': amount,
      'status': status.toString().split('.').last,
      'method': method,
    };
  }

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      id: json['id'],
      date: DateTime.parse(json['date']),
      amount: json['amount'],
      status: PaymentStatus.values.firstWhere(
        (e) => e.toString().split('.').last == json['status'],
      ),
      method: json['method'],
    );
  }
}

enum PaymentStatus {
  paid,
  pending,
  failed,
}
