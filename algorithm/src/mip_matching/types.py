"""
Typealiaser
"""

from typing import TypedDict, TYPE_CHECKING
import mip
if TYPE_CHECKING:
    # Unngår cyclic import
    from mip_matching.Applicant import Applicant
    from mip_matching.Committee import Committee
    from mip_matching.TimeInterval import TimeInterval


type Room = str
type Matching = tuple[Applicant, Committee, TimeInterval, Room]

class MeetingMatch(TypedDict):
    """Type definition of a meeting match object"""
    solver_status: mip.OptimizationStatus
    matched_meetings: int
    total_wanted_meetings: int
    matchings: list[Matching]