from typing import Any
from jinja2.environment import Environment

MAX_RANGE = ...  # type: int
UNSAFE_FUNCTION_ATTRIBUTES = ...  # type: Any
UNSAFE_METHOD_ATTRIBUTES = ...  # type: Any
UNSAFE_GENERATOR_ATTRIBUTES = ...  # type: Any

def safe_range(*args): ...
def unsafe(f): ...
def is_internal_attribute(obj, attr): ...
def modifies_known_mutable(obj, attr): ...

class SandboxedEnvironment(Environment):
    sandboxed = ...  # type: bool
    default_binop_table = ...  # type: Any
    default_unop_table = ...  # type: Any
    intercepted_binops = ...  # type: Any
    intercepted_unops = ...  # type: Any
    def intercept_unop(self, operator): ...
    binop_table = ...  # type: Any
    unop_table = ...  # type: Any
    def __init__(self, *args, **kwargs) -> None: ...
    def is_safe_attribute(self, obj, attr, value): ...
    def is_safe_callable(self, obj): ...
    def call_binop(self, context, operator, left, right): ...
    def call_unop(self, context, operator, arg): ...
    def getitem(self, obj, argument): ...
    def getattr(self, obj, attribute): ...
    def unsafe_undefined(self, obj, attribute): ...
    def call(__self, __context, __obj, *args, **kwargs): ...

class ImmutableSandboxedEnvironment(SandboxedEnvironment):
    def is_safe_attribute(self, obj, attr, value): ...
