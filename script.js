document.addEventListener('DOMContentLoaded', function () {
    const tabela = document.querySelector(".tabela-js");
  
    axios.get(` http://10.109.142.63:5000/list`)
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
  
            axios.post(` http://10.109.142.63:5000/add`, { Tarefa: tarefa })
                .then(function () {
                    loadTasks();
                })
                .catch(function (error) {
                    console.error(error);
                });
          });
  
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", function (e) {
                const id = e.target.parentElement.parentElement.firstElementChild.textContent;
                axios.delete(` http://10.109.142.63:5000/delete/${id}`)
                    .then(function () {
                        loadTasks();
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            });
        });
  
        document.querySelector(".tabela-js").addEventListener("click", function (e) {
            const editBtn = e.target.closest(".edit-btn");
            if (editBtn) {
                const row = editBtn.closest("tr");
                const id = row.querySelector("th").textContent;
                const tarefa = row.querySelector("td").textContent;
                document.querySelector("#edit-tarefa").value = tarefa;
            }
        });
  
        document.querySelector("#edit-tarefa-btn").addEventListener("click", function () {
            const tarefaupdate = document.querySelector("#edit-tarefa").value;
            const id = document.querySelector(".edit-btn").parentElement.parentElement.firstElementChild.textContent;
            
            if (id) {
                axios.put(` http://10.109.142.63:5000/${id}`, { Tarefa: tarefaupdate })
                    .then(function () {
                        loadTasks();
                    })
                    .catch(function (error) {
                        console.error(error);
                    })
                    .finally(function () {
                        id = null;
                    });
            }
        });
      }
  
    function loadTasks() {
        axios.get(` http://10.109.142.63:5000/list`)
            .then(function (resposta) {
                getData(resposta.data);
            })
            .catch(function (error) {
                console.error(error);
            });
          }
      });