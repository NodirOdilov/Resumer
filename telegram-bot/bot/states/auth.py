"""FSM-состояния аутентификации."""

from aiogram.fsm.state import State, StatesGroup


class AuthStates(StatesGroup):
    waiting_email = State()
    waiting_password = State()
    waiting_register_email = State()
    waiting_register_password = State()
    waiting_link_token = State()


class CreateResumeStates(StatesGroup):
    waiting_title = State()


class AIStates(StatesGroup):
    waiting_job_title = State()


class SearchStates(StatesGroup):
    waiting_query = State()
