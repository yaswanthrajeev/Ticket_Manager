from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum
from datetime import datetime
import enum
db = SQLAlchemy()

class TicketStatus(enum.Enum):
    OPEN = 'Open'
    IN_PROGRESS = 'In Progress'
    CLOSED = 'Closed'
    REOPENED = 'Reopened'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    tickets = db.relationship('Ticket', backref='owner', lazy=True)
    is_admin = db.Column(db.Boolean, default=False)
    

    def __repr__(self):
        return f'<User {self.username}>'

class Ticket(db.Model):
    attachment = db.Column(db.String(255),nullable=True)
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(Enum(TicketStatus), default=TicketStatus.OPEN)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Ticket {self.title} Status:{self.status}>'
class TicketLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('ticket.id'), nullable=False)
    action = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<TicketLog {self.ticket_id}: {self.action} at {self.timestamp}>'