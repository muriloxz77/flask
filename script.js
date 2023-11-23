document.addEventListener('DOMContentLoaded', function () {
    const tabela = document.querySelector(".tabela-js");

    axios.get(`http://127.0.0.1:5000/list`)
        .then(function (resposta) {
            getData(resposta.data);
        })
        .catch(function (error) {
            console.error(error);
        });

    function getData(dados) {
        tabela.innerHTML = dados.map(item => `
        <tr>
        <th scope="row">${item.ID}</th>
        <td>${item.TAREFA}</td>
        <td><button class="btn bg-white delete-btn" type="button" data-bs-toggle="modal" data-bs-target="#modalDel"><span class="material-symbols-outlined text-danger">
        delete
        </span></button> <button class="btn bg-white edit-btn" id="edit-tarefa-btn"  type="button" data-bs-toggle="modal" data-bs-target="#modalEdit"><span class="material-symbols-outlined text-success">
        edit
        </span></button></td>
    </tr>`
        ).join('');

        todos_Eventos();
    };

    function todos_Eventos() {
        document.querySelector("#add-tarefa").addEventListener("click", function () {
            const tarefa = document.querySelector("#tarefa").value;
            if (tarefa === "") {
                alert("Digite uma tarefa!");
                return;
            }

            axios.post(`http://127.0.0.1:5000/add`, { Tarefa: tarefa })
                .then(function () {
                    loadTasks();
                })
                .catch(function (error) {
                    console.error(error);
                });
        });

        // EXCLUIR TAREFA
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", function (e) {
                const id = e.target.closest("tr").querySelector("th").textContent;
                axios.delete(`http://127.0.0.1:5000/delete`, { data: { id: parseInt(id) } })
                    .then(function () {
                        loadTasks();
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            });
        });

        function updateTarefa(id, novaTarefa) {
            axios.put(`http://127.0.0.1:5000/update/${id}`, { TAREFA: novaTarefa })
                .then(function () {
                    Carregar();
                })
                .catch(function (error) {
                    console.error(error);
                });
        }

        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", function (e) {
                const id = e.target.closest("tr").querySelector("th").textContent;
                
                const novaTarefa = prompt("Digite a nova descrição da tarefa:");

                if (novaTarefa !== null) {
                    updateTarefa(parseInt(id), novaTarefa);
                }
            });
        });



    }

    function loadTasks() {
        axios.get(`http://127.0.0.1:5000/list`)
            .then(function (resposta) {
                getData(resposta.data);
            })
            .catch(function (error) {
                console.error(error);
            });
    }
});
