from flask import Blueprint, request, session, jsonify
from models import db, Ticket,TicketLog,TicketStatus
from flask import send_from_directory, current_app
import os


ticket=Blueprint('tickets',__name__)


@ticket.route('/uploads/<filename>')
def uploaded_file(filename):
    upload_folder = os.path.join(current_app.root_path, 'uploads')
    return send_from_directory(upload_folder, filename)

@ticket.route('/tickets/search',methods=['GET'])
def search_tickets():
    query=request.args.get('query')
    if not query:
        return jsonify({'error': 'No query provided'}), 400
    try:
        tickets = Ticket.query.filter(
        db.or_(
            Ticket.title.ilike(f"%{query}%"),
            Ticket.description.ilike(f"%{query}%")
        )
        ).all()
        return jsonify([{'id':t.id,'title':t.title,'description':t.description,'status':t.status.value,'attachment_url': f"/uploads/{t.attachment}" if t.attachment else None} 
                        for t in tickets])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@ticket.route('/tickets',methods=['POST'])
def create_ticket():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    title=request.form.get('title')
    description=request.form.get('description')
    attachment=request.files.get('attachment')
    filename=attachment.filename if attachment else None
    if attachment:
        upload_folder=os.path.join(current_app.root_path,'uploads')
        os.makedirs(upload_folder,exist_ok=True)
        filename=attachment.filename
        attachment.save(os.path.join(upload_folder,filename))
    ticket = Ticket(
        title=title,
        description=description,
        user_id=session['user_id'],
        attachment=filename
    )
    db.session.add(ticket)
    db.session.commit()
    return jsonify({"message": "Ticket created successfully"}), 201
@ticket.route('/tickets', methods=['GET'])
def get_tickets():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    status = request.args.get('status')
    title = request.args.get('title')

    query = Ticket.query.filter_by(user_id=session['user_id'])

    if status and status != 'all':
        query = query.filter(Ticket.status == status)

    if title and title != 'all':
        query = query.filter(Ticket.title.ilike(f"%{title}%"))

    tickets = query.all()

    ticket_list = [
        {'id': t.id, 'title': t.title, 'description': t.description, 'status': t.status.value,'attachment_url': f"/uploads/{t.attachment}" if t.attachment else None}
        for t in tickets
    ]
    return jsonify(ticket_list)

@ticket.route('/tickets/<int:ticket_id>',methods=['PUT'])
def update_ticket(ticket_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    ticket = Ticket.query.get_or_404(ticket_id)
    if ticket.user_id != session['user_id']:
        return jsonify({'error': 'Forbidden'}), 403

    data = request.json
    status_input = data.get('status')
    log_message = []
    if status_input:
        if status_input not in TicketStatus._value2member_map_:
            return jsonify({'error': 'Invalid status value'}), 400
        log_message.append(f"Status changed to {status_input}")
        ticket.status = TicketStatus(status_input)

    if log_message:
        log = TicketLog(ticket_id=ticket.id, action="; ".join(log_message))
        db.session.add(log)
    db.session.commit()
    return jsonify({'message': 'Ticket updated successfully'})

@ticket.route('/tickets/<int:ticket_id>', methods=['DELETE'])
def delete_ticket(ticket_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    ticket = Ticket.query.get_or_404(ticket_id)
    if ticket.user_id != session['user_id']:
        return jsonify({'error': 'Forbidden'}), 403

    db.session.delete(ticket)
    db.session.commit()
    return jsonify({'message': 'Ticket deleted successfully'})

