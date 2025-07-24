from flask import Blueprint, request, jsonify,session
from main.models import db, User, Ticket, TicketLog, TicketStatus


admin=Blueprint('admin',__name__)

def is_admin():
    user_id=session.get('user_id')
    user=User.query.get(user_id)
    return user and user.is_admin    
@admin.route('/admin/tickets',methods=['GET'])
def get_all_tickets():
    if not is_admin():
        return jsonify({'error':' Unauthorized'}), 401
    tickets=Ticket.query.all()
    ticket_list = [{
        'id': t.id,
        'title': t.title,
        'description': t.description,
        'status': t.status.value if hasattr(t.status, 'value') else t.status,
        'user': User.query.get(t.user_id).username
    } for t in tickets]
    return jsonify(ticket_list)

@admin.route('/admin/tickets/<int:ticket_id>', methods=['PUT'])
def admin_update_ticket(ticket_id):
    if not is_admin():
        return jsonify({'error': 'Unauthorized'}), 401

    ticket = Ticket.query.get_or_404(ticket_id)
    data = request.json
    status_input = data.get('status')
    if status_input:
        if status_input not in TicketStatus._value2member_map_:
            return jsonify({'error': 'Invalid status value'}), 400
        ticket.status = TicketStatus(status_input)
    
    db.session.commit()
    return jsonify({'message': 'Ticket updated successfully'})
@admin.route('/admin/tickets/<int:ticket_id>/logs', methods=['GET'])
def view_ticket_logs(ticket_id):
    if not is_admin():
        return jsonify({'error':' Unauthorized'}), 401
    logs=TicketLog.query.filter_by(ticket_id=ticket_id).order_by(TicketLog.timestamp.desc()).all()
    log_list = [{
        'action': log.action,
        'timestamp': log.timestamp.isoformat()
    } for log in logs]

    return jsonify(log_list)