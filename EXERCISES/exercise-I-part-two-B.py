import requests
from rich.console import Console
from rich import box
from rich.table import Table


def fetch_swapi_data():
    url = "https://swapi.info/api/planets"

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()

        table = Table(
            show_header=True,
            header_style="bold white",
            box=box.SQUARE,
            border_style="grey70",
        )
        table.add_column("NAME", style="magenta")
        table.add_column("DIAMETER", style="blue")
        table.add_column("POPULATION", style="cyan")

        for planet in data:
            table.add_row(
                planet["name"],
                planet["diameter"],
                planet["population"],
            )
            if planet["name"] == "Kashyyyk":
                break

        Console().print(table)
        return data

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None


fetch_swapi_data()
