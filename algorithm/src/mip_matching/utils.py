from mip_matching.Applicant import Applicant
from mip_matching.Committee import Committee
from mip_matching.TimeInterval import TimeInterval

from datetime import time, date, datetime, timedelta


def group_by_committee(meetings: list[tuple[Applicant, Committee, TimeInterval]]) -> dict[Committee, list[tuple[Applicant, Committee, TimeInterval]]]:
    result = {}

    for applicant, committee, interval in meetings:
        if committee not in result:
            result[committee] = []

        result[committee].append((applicant, committee, interval))

    return result


def measure_cluttering(meetings: list[tuple[Applicant, Committee, TimeInterval]]) -> int:
    grouped_meetings = group_by_committee(meetings)

    holes = 0

    for _, committee_meetings in grouped_meetings.items():
        committee_meetings.sort(key=lambda meeting: meeting[2].end)

        previous_interval: TimeInterval = committee_meetings[0][2]
        for _, _, interval in committee_meetings[1:]:
            if not previous_interval.is_within_distance(interval, timedelta(minutes=1)):
                holes += 1
            previous_interval = interval

    return holes


def subtract_time(minuend: time, subtrahend: time) -> timedelta:
    minuend_date = datetime.combine(date.min, minuend)
    subtrahend_date = datetime.combine(date.min, subtrahend)

    return minuend_date - subtrahend_date
