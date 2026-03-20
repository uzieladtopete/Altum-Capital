class Libro:
    GENEROS_VALIDOS = ["Ficción", "Ciencia", "Historia", "Tecnología", "Arte", "Otro"]

    def __init__(self, titulo, autor, anio, precio, genero):
        self.__titulo  = titulo
        self.__autor   = autor
        self.__anio    = anio
        self.__genero  = genero
        self.__precio  = 0.0
        self.set_precio(precio)

    # --- Getters ---
    def get_titulo(self):
        return self.__titulo

    def get_autor(self):
        return self.__autor

    def get_anio(self):
        return self.__anio

    def get_genero(self):
        return self.__genero

    def get_precio(self):
        return self.__precio

    # --- Setters con validación ---
    def set_precio(self, nuevo_precio):
        if isinstance(nuevo_precio, (int, float)) and nuevo_precio > 0:
            self.__precio = float(nuevo_precio)
        else:
            print(f"Precio inválido para '{self.__titulo}'. Debe ser un número mayor a 0.")

    def set_genero(self, nuevo_genero):
        if isinstance(nuevo_genero, str) and nuevo_genero in Libro.GENEROS_VALIDOS:
            self.__genero = nuevo_genero
        else:
            print(f"Género inválido. Opciones: {Libro.GENEROS_VALIDOS}")

    # --- Métodos especiales ---
    def __str__(self):
        return (f'"{self.__titulo}" | {self.__autor} | '
                f'{self.__anio} | {self.__genero} | ${self.__precio:.2f}')

    def __repr__(self):
        return f'Libro("{self.__titulo}", "{self.__autor}", {self.__anio}, {self.__precio}, "{self.__genero}")'


class Biblioteca:
    def __init__(self, nombre):
        self.__nombre = nombre
        self.__libros = []
        self.__libros_prestados = []

    def get_nombre(self):
        return self.__nombre

    def agregar_libro(self, libro):
        for a in self.__libros:
            if a.get_titulo() == libro.get_titulo():
                print(f"El libro '{libro.get_titulo()}' ya está en la biblioteca {self.__nombre}.")
                return
        self.__libros.append(libro)
        print(f"Libro '{libro.get_titulo()}' agregado a la biblioteca {self.__nombre}.")

    def mostrar_libros(self):
        if not self.__libros:
            print("No hay libros en la biblioteca.")
        for libro in self.__libros:
            print(libro)

    def prestar_libro(self, libro):
        for a in self.__libros:
            if a.get_titulo() == libro.get_titulo():
                self.__libros.remove(a)
                self.__libros_prestados.append(libro)
                return

    def devolver_libro(self, libro):
        for a in self.__libros_prestados:
            if a.get_titulo() == libro.get_titulo():
                self.__libros_prestados.remove(a)
                self.__libros.append(libro)
                print(f"Libro '{libro.get_titulo()}' devuelto a la biblioteca {self.__nombre}.")
                return
        print(f"El libro '{libro.get_titulo()}' no estaba prestado.")

    def libros_contador(self):
        print(
            f"Total de libros disponibles en la biblioteca {self.__nombre}: "
            f"{len(self.__libros)}, libros prestados: {len(self.__libros_prestados)}"
        )

    def buscar_autor(self, autor):
        for a in self.__libros:
            if a.get_autor() == autor:
                print(f"Libro encontrado: {a}")
                return
        print(f"No se encontraron libros de {autor} en la biblioteca {self.__nombre}.")

    def ordenar_años(self):
        self.__libros.sort(key=lambda libro: libro.get_anio())
        for libro in self.__libros:
            print(f" - {libro.get_titulo()} ({libro.get_anio()})")

    def __str__(self):
        return (
            f"Biblioteca: {self.__nombre}\n"
            f"Total de libros: {len(self.__libros)}\n"
            f"Libros prestados: {len(self.__libros_prestados)}\n"
            f"Libros:\n"
            + "\n".join([f" - {libro.get_titulo()} ({libro.get_anio()})" for libro in self.__libros])
        )


l1 = Libro("Dune", "Frank Herbert", 1965, 299.99, "Ficción")
l2 = Libro("Cosmos", "Carl Sagan", 1980, 249.99, "Ciencia")
l3 = Libro("Sapiens", "Yuval Noah Harari", 2011, 199.99, "Historia")

b = Biblioteca("Central")
b.agregar_libro(l1)
b.agregar_libro(l2)
b.agregar_libro(l3)

print("\n--- Mostrar libros ---")
b.mostrar_libros()

print("\n--- Ordenar por año ---")
b.ordenar_años()

print("\n--- Prestar libro ---")
b.prestar_libro(l2)
b.libros_contador()

print("\n--- Devolver libro ---")
b.devolver_libro(l2)

print("\n--- Buscar autor ---")
b.buscar_autor("Carl Sagan")
