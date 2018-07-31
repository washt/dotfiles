from typing import Any

__revision__ = ...  # type: str

class FortunaPool:
    digest_size = ...  # type: Any
    def __init__(self) -> None: ...
    def append(self, data): ...
    def digest(self): ...
    def hexdigest(self): ...
    length = ...  # type: int
    def reset(self): ...

def which_pools(r): ...

class FortunaAccumulator:
    min_pool_size = ...  # type: int
    reseed_interval = ...  # type: float
    reseed_count = ...  # type: int
    generator = ...  # type: Any
    last_reseed = ...  # type: Any
    pools = ...  # type: Any
    def __init__(self) -> None: ...
    def random_data(self, bytes): ...
    def add_random_event(self, source_number, pool_number, data): ...
